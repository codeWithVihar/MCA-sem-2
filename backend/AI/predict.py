import os
import numpy as np
import joblib
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
from bson import ObjectId

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database()

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")


def _load(path):
    if os.path.exists(path):
        return joblib.load(path)
    return None


def predict_sales(days=1):
    model = _load(os.path.join(MODEL_DIR, "sales_model.pkl"))
    meta = _load(os.path.join(MODEL_DIR, "sales_meta.pkl"))
    if model is None or meta is None:
        return {"error": "Model not trained"}

    last_date = meta["last_date"]
    if isinstance(last_date, str):
        last_date = datetime.fromisoformat(last_date)

    results = []
    for i in range(1, days + 1):
        d = last_date + timedelta(days=i)
        day_index = meta["max_index"] + i
        features = np.array([[
            d.weekday(),
            d.day,
            d.month,
            day_index,
            meta["mean_sales"]
        ]])
        pred = max(0, model.predict(features)[0])
        results.append({"date": d.strftime("%Y-%m-%d"), "predicted_sales": round(pred, 2)})

    return results


def predict_tomorrow():
    r = predict_sales(1)
    return r[0] if isinstance(r, list) else r


def predict_weekly():
    return predict_sales(7)


def predict_monthly():
    return predict_sales(30)


def predict_demand():
    models = _load(os.path.join(MODEL_DIR, "demand_model.pkl"))
    product_ids = _load(os.path.join(MODEL_DIR, "demand_products.pkl"))
    if models is None or product_ids is None:
        return {"error": "Demand models not trained"}

    today = datetime.now()
    results = []

    # Calculate a reasonable day_index using sales meta if available
    meta_path = os.path.join(MODEL_DIR, "sales_meta.pkl")
    base_day_index = 180
    if os.path.exists(meta_path):
        meta = joblib.load(meta_path)
        base_day_index = meta.get("max_index", 180) + 1

    for pid in product_ids[:20]:
        model = models.get(pid)
        if model is None:
            continue
        features = np.array([[today.weekday(), today.month, base_day_index]])
        pred = max(0, model.predict(features)[0])
        product = db.products.find_one({"_id": ObjectId(pid)})
        name = product["productName"] if product else "Unknown"
        results.append({
            "productId": pid,
            "productName": name,
            "predicted_daily_demand": round(pred, 1)
        })

    results.sort(key=lambda x: x["predicted_daily_demand"], reverse=True)
    return results[:10]


def recommend_restock():
    products = list(db.products.find({"status": "Active"}))
    if not products:
        return []

    product_ids = [p["_id"] for p in products]

    # Single aggregation to get avg daily sales for ALL products
    pipeline = [
        {"$unwind": "$items"},
        {"$match": {"items.product": {"$in": product_ids}}},
        {"$group": {"_id": "$items.product", "avg": {"$avg": "$items.quantitySold"}}}
    ]
    avg_results = list(db.sales.aggregate(pipeline))
    avg_map = {str(r["_id"]): r["avg"] for r in avg_results}

    recs = []
    for p in products:
        avg_daily = avg_map.get(str(p["_id"]), 0)
        safety_stock = p.get("minStockLevel", 10) * 0.5
        predicted_30d = avg_daily * 30
        current = p.get("currentStock", 0)
        recommended = max(0, predicted_30d + safety_stock - current)

        recs.append({
            "productId": str(p["_id"]),
            "productName": p["productName"],
            "currentStock": current,
            "avgDailySales": round(avg_daily, 1),
            "predictedDemand30d": round(predicted_30d, 1),
            "safetyStock": round(safety_stock, 1),
            "recommendedQty": round(recommended, 0),
            "supplier": str(p.get("supplier", ""))
        })

    recs.sort(key=lambda x: x["recommendedQty"], reverse=True)
    return recs


def predict_stockout():
    products = list(db.products.find({"status": "Active", "currentStock": {"$gt": 0}}))
    if not products:
        return []

    product_ids = [p["_id"] for p in products]

    pipeline = [
        {"$unwind": "$items"},
        {"$match": {"items.product": {"$in": product_ids}}},
        {"$group": {"_id": "$items.product", "avg": {"$avg": "$items.quantitySold"}}}
    ]
    avg_results = list(db.sales.aggregate(pipeline))
    avg_map = {str(r["_id"]): r["avg"] for r in avg_results}

    results = []
    for p in products:
        avg_daily = avg_map.get(str(p["_id"]), 0)

        if avg_daily > 0:
            days = p["currentStock"] / avg_daily
        else:
            days = 999

        results.append({
            "productId": str(p["_id"]),
            "productName": p["productName"],
            "currentStock": p["currentStock"],
            "avgDailySales": round(avg_daily, 1),
            "daysUntilStockout": round(days, 1)
        })

    results.sort(key=lambda x: x["daysUntilStockout"])
    return results


def classify_movement():
    cutoff = datetime.now() - timedelta(days=90)
    pipeline = [
        {"$unwind": "$items"},
        {"$match": {"createdAt": {"$gte": cutoff}}},
        {"$group": {"_id": "$items.product", "total": {"$sum": "$items.quantitySold"}}}
    ]
    sales_data = list(db.sales.aggregate(pipeline))
    if not sales_data:
        return {"fast": 0, "medium": 0, "slow": 0, "products": []}

    totals = [s["total"] for s in sales_data]
    q33, q66 = np.percentile(totals, [33, 66]) if len(totals) >= 3 else (0, 0)

    fast, medium, slow = 0, 0, 0
    details = []
    for s in sales_data:
        product = db.products.find_one({"_id": s["_id"]})
        name = product["productName"] if product else "Unknown"
        if s["total"] >= q66:
            cls = "Fast"
            fast += 1
        elif s["total"] >= q33:
            cls = "Medium"
            medium += 1
        else:
            cls = "Slow"
            slow += 1
        details.append({
            "productId": str(s["_id"]),
            "productName": name,
            "totalSold90d": s["total"],
            "classification": cls
        })

    details.sort(key=lambda x: x["totalSold90d"], reverse=True)
    return {"fast": fast, "medium": medium, "slow": slow, "products": details}


def predict_profit():
    rev_model = _load(os.path.join(MODEL_DIR, "revenue_model.pkl"))
    prof_model = _load(os.path.join(MODEL_DIR, "profit_model.pkl"))
    meta = _load(os.path.join(MODEL_DIR, "profit_meta.pkl"))
    if rev_model is None or prof_model is None or meta is None:
        return {"error": "Profit models not trained"}

    last_idx = meta["last_idx"]
    next_idx = last_idx + 1

    next_revenue = max(0, rev_model.predict([[next_idx]])[0])
    next_profit = max(0, prof_model.predict([[next_idx]])[0])

    return {
        "nextMonthRevenue": round(next_revenue, 2),
        "nextMonthProfit": round(next_profit, 2)
    }


def recommend_supplier():
    suppliers = list(db.suppliers.find({"status": "Active"}))
    if not suppliers:
        return []

    min_price = None
    for s in suppliers:
        products = list(db.products.find({"supplier": s["_id"]}))
        prices = [p.get("purchasePrice", 0) for p in products if p.get("purchasePrice")]
        if prices:
            avg_price = sum(prices) / len(prices)
        else:
            avg_price = 0
        s["_avgPrice"] = avg_price
        s["_productCount"] = len(products)
        if min_price is None or avg_price < min_price:
            min_price = avg_price

    results = []
    for s in suppliers:
        rating = s.get("rating", 3)
        delivery = s.get("deliveryTimeDays", 7)
        avg_price = s.get("_avgPrice", 0)
        product_count = s.get("_productCount", 0)

        price_score = 0
        if min_price and min_price > 0 and avg_price > 0:
            price_score = min(100, (min_price / avg_price) * 100)

        delivery_score = max(0, 100 - (delivery - 1) * 10)
        rating_score = (rating / 5) * 100

        overall = round(price_score * 0.4 + delivery_score * 0.3 + rating_score * 0.3, 1)

        results.append({
            "supplierId": str(s["_id"]),
            "supplierName": s["supplierName"],
            "overallScore": overall,
            "priceScore": round(price_score, 1),
            "deliveryScore": round(delivery_score, 1),
            "ratingScore": round(rating_score, 1),
            "avgPrice": round(avg_price, 2),
            "deliveryTimeDays": delivery,
            "rating": rating,
            "productCount": product_count
        })

    results.sort(key=lambda x: x["overallScore"], reverse=True)
    return results


def health_score():
    products = list(db.products.find({"status": "Active"}))
    if not products:
        return {"score": 0, "details": {}}

    total = len(products)
    low_stock = sum(1 for p in products if 0 < p.get("currentStock", 0) <= p.get("minStockLevel", 10))
    out_stock = sum(1 for p in products if p.get("currentStock", 0) == 0)

    cutoff_90 = datetime.now() - timedelta(days=90)
    sold_pipeline = [
        {"$unwind": "$items"},
        {"$match": {"createdAt": {"$gte": cutoff_90}}},
        {"$group": {"_id": "$items.product", "total": {"$sum": "$items.quantitySold"}}}
    ]
    sold_data = list(db.sales.aggregate(sold_pipeline))
    sold_ids = {str(s["_id"]) for s in sold_data}
    dead = sum(1 for p in products if str(p["_id"]) not in sold_ids)

    low_stock_pct = low_stock / total if total else 0
    out_stock_pct = out_stock / total if total else 0
    dead_pct = dead / total if total else 0

    score = max(0, 100 - (low_stock_pct * 20 + out_stock_pct * 40 + dead_pct * 25))

    turnover_data = list(db.sales.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$grandTotal"}}}
    ]))
    total_sales = turnover_data[0]["total"] if turnover_data else 0
    inv_value = sum(p.get("currentStock", 0) * p.get("purchasePrice", 0) for p in products)
    turnover = total_sales / inv_value if inv_value else 0

    return {
        "score": round(score, 1),
        "details": {
            "totalProducts": total,
            "lowStockCount": low_stock,
            "outOfStockCount": out_stock,
            "deadStockCount": dead,
            "inventoryTurnover": round(turnover, 2),
            "totalInventoryValue": round(inv_value, 2)
        }
    }


def get_dashboard():
    return {
        "sales_prediction": predict_tomorrow(),
        "weekly_prediction": [round(r["predicted_sales"], 2) for r in predict_weekly()] if isinstance(predict_weekly(), list) else [],
        "monthly_prediction": [round(r["predicted_sales"], 2) for r in predict_monthly()] if isinstance(predict_monthly(), list) else [],
        "demand_forecast": predict_demand(),
        "restock": recommend_restock()[:5],
        "stockout": predict_stockout()[:10],
        "movement": classify_movement(),
        "profit": predict_profit(),
        "suppliers": recommend_supplier()[:5],
        "health": health_score()
    }
