from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from plaid import ApiClient, Configuration, Environment
from plaid.api import plaid_api
from plaid.model.products import Products
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from datetime import datetime,timedelta
from matcher import match_transactions_to_invoices
from mock_invoices import mock_invoices
from pydantic import BaseModel
from typing import List
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    transaction_id: str
    name: str
    amount: float
    date: str
    category: List[str]

configuration = Configuration(
    host=Environment.Sandbox,
    api_key={
        'clientId': '67f186ad246ca90023f97d8c',
        'secret': 'a1a858a657daa550314382b071a287',
    }
)

api_client = ApiClient(configuration)
plaid_client = plaid_api.PlaidApi(api_client)


# Generate a sandbox access token (temporary)
@app.get("/create_sandbox_token")
def create_sandbox_token():
    from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest
    from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
    from fastapi import HTTPException

    try:
        request = SandboxPublicTokenCreateRequest(
            institution_id="ins_109508",
            initial_products=[Products("transactions")]
        )
        response = plaid_client.sandbox_public_token_create(request)
        public_token = response.public_token

        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)

        return {"access_token": exchange_response.access_token}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#Fetch transactions using access token
# @app.get("/transactions")
# def get_transactions(access_token: str):
#     end_date = datetime.now().date()    
#     start_date = end_date - timedelta(days=30)

#     request = TransactionsGetRequest(
#         access_token=access_token,
#         start_date=start_date,
#         end_date=end_date,
#         options=TransactionsGetRequestOptions(count=20)
#     )

#     response = plaid_client.transactions_get(request)
#     transactions = response.transactions

#     simplified_transactions = [
#         {
#             "count": i+1,
#             "transaction_id": tx.transaction_id,
#             "name": tx.name,
#             "amount": tx.amount,
#             "date": tx.date.isoformat(),
#             "category": tx.category
#         } for i, tx in enumerate(transactions)
#     ]

#     return simplified_transactions

@app.get("/transactions")
def get_transactions(access_token: str = Query(...)):
    cert = ("certs/certificate.pem", "certs/private_key.pem")  

    try:
        accounts_res = requests.get(
            "https://api.teller.io/accounts",
            auth=(access_token, ""),  # ✅ Use Basic Auth
            cert=cert
        )

        if accounts_res.status_code != 200:
            return {"error": "Failed to fetch accounts", "detail": accounts_res.text}

        accounts = accounts_res.json()
        if not accounts:
            return {"error": "No linked accounts found"}

        account_id = accounts[0]["id"]


        tx_res = requests.get(
            f"https://api.teller.io/accounts/{account_id}/transactions",
            auth=(access_token, ""),  # ✅ Basic Auth again
            cert=cert
        )

        if tx_res.status_code != 200:
            return {"error": "Failed to fetch transactions", "detail": tx_res.text}

        transactions = tx_res.json()

        simplified = [
            {
                "count": i+1,
                "transaction_id": tx["id"],
                "name": tx["description"],
                "amount": float(tx["amount"]),
                "date": tx["date"],
                "category": [tx.get("details", {}).get("category") or "uncategorized"],   
                "to": [tx.get("details", {}).get("counterparty").get("name")]
            }
            for i, tx in enumerate(transactions)
        ]

        return simplified

    except Exception as e:
        return {"error": "Unexpected error", "detail": str(e)}

@app.get("/")
async def root():
    return {"message": "Hello, ReconAI is running!"}

@app.post("/reconcile")
def reconcile(transactions: list[Transaction]):
    tx_list = [tx.dict() for tx in transactions]
    matches = match_transactions_to_invoices(tx_list, mock_invoices)
    return matches

@app.get("/mock_invoices")
def get_mock_invoices():
    return mock_invoices
