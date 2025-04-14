from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime

model = SentenceTransformer("all-MiniLM-L6-v2")

def match_transactions_to_invoices(transactions, invoices, amount_threshold=2.0, date_window=3):
    results = []

    match_invoice_ids = set()
    match_transaction_ids = set()
    # Vectorize all descriptions
    transaction_descs = [t['name'] for t in transactions]
    invoice_descs = [i['description'] for i in invoices]

    transaction_vectors = model.encode(transaction_descs)
    invoice_vectors = model.encode(invoice_descs)

    sim_matrix = cosine_similarity(transaction_vectors, invoice_vectors)

    for t_idx, transaction in enumerate(transactions):
        best_match = None
        best_score = -1

        for i_idx, invoice in enumerate(invoices):
            # Amount match
            amt_diff = abs(transaction["amount"] - invoice["amount"])
            amt_match = amt_diff <= amount_threshold

            # Date match
            t_date = datetime.fromisoformat(transaction["date"]).date()
            i_date = invoice["date"]
            if isinstance(i_date, str):
                i_date = datetime.fromisoformat(i_date).date()
            date_diff = abs((t_date - i_date).days)
            date_match = date_diff <= date_window

            # NLP similarity
            text_score = sim_matrix[t_idx][i_idx]

            # Simple weighted score
            final_score = (1 - amt_diff / amount_threshold) * 0.4 + (1 - date_diff / date_window) * 0.3 + text_score * 0.3

            if amt_match and date_match and final_score > best_score:
                best_score = final_score
                best_match = {
                    "name": transaction["name"],
                    "transaction_id": transaction["transaction_id"],
                    "invoice_id": invoice["invoice_id"],
                    "score": float(round(final_score, 3)),
                    "description_similarity": float(round(text_score, 3)),
                    "amount_difference": float(round(amt_diff, 2)),
                    "date_difference": int(date_diff)
                }

        if best_match and best_score >= 0.7:
            results.append(best_match)
            match_transaction_ids.add(best_match["transaction_id"])
            match_invoice_ids.add(best_match["invoice_id"])

        unmatched_transactions = [
            t for t in transactions if t["transaction_id"] not in match_transaction_ids
        ]

        unmatched_invoices = [
            i for i in invoices if i["invoice_id"] not in match_invoice_ids
        ]
        


    return {
        "matches": results,
        "unmatched_transactions": unmatched_transactions,
        "unmatched_invoices": unmatched_invoices
    }
