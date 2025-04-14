import requests

access_token = "access-sandbox-8d595fc7-05a7-4ca3-ad21-d8368bbac912"

# STEP 2: Fetch transactions from your FastAPI backend
transactions_url = f"http://localhost:8000/transactions?access_token={access_token}"
transactions_response = requests.get(transactions_url)

if transactions_response.status_code != 200:
    print("❌ Failed to fetch transactions")
    print(transactions_response.text)
    exit()

transactions = transactions_response.json()
print(f"Fetched {len(transactions)} transactions.")

# STEP 3: Send those transactions to /reconcile
reconcile_url = "http://localhost:8000/reconcile"
reconcile_response = requests.post(reconcile_url, json=transactions)

if reconcile_response.status_code != 200:
    print("Reconciliation failed")
    print(reconcile_response.text)
    exit()

# STEP 4: Show results
results = reconcile_response.json()
print("\n Matches:")
for match in results["matches"]:
    print(match)

print("\n Unmatched Transactions:")
for tx in results["unmatched_transactions"]:
    print(tx["name"], "-", tx["amount"], "-", tx["date"])

print("\n Unmatched Invoices:")
for inv in results["unmatched_invoices"]:
    print(inv["description"], "-", inv["amount"], "-", inv["date"])

