import os
import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import joblib
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database()

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

SALES_MODEL_PATH = os.path.join(MODEL_DIR, "sales_model.pkl")
DEMAND_MODEL_PATH = os.path.join(MODEL_DIR, "demand_model.pkl")
PROFIT_MODEL_PATH = os.path.join(MODEL_DIR, "profit_model.pkl")
DEMAND_PRODUCTS_PATH = os.path.join(MODEL_DIR, "demand_products.pkl")


def train_sales_model():
    pipeline = [
        {"$group": {
            "_id": {
                "year": {"$year": "$createdAt"},
                "month": {"$month": "$createdAt"},
                "day": {"$dayOfMonth": "$createdAt"}
            },
            "total_sales": {"$sum": "$grandTotal"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}}
    ]
    data = list(db.sales.aggregate(pipeline))
    if len(data) < 10:
        print("Not enough sales data for training")
        return None

    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["_id"].apply(lambda x: f"{x['year']}-{x['month']:02d}-{x['day']:02d}"))
    df = df.sort_values("date")

    df["day_of_week"] = df["date"].dt.dayofweek
    df["day_of_month"] = df["date"].dt.day
    df["month"] = df["date"].dt.month
    df["day_index"] = (df["date"] - df["date"].min()).dt.days
    df["rolling_7day_avg"] = df["total_sales"].shift(1).rolling(7, min_periods=1).mean().fillna(df["total_sales"].mean())

    features = ["day_of_week", "day_of_month", "month", "day_index", "rolling_7day_avg"]
    X = df[features].values
    y = df["total_sales"].values

    model = LinearRegression()
    model.fit(X, y)
    joblib.dump(model, SALES_MODEL_PATH)

    meta = {
        "last_date": df["date"].max(),
        "min_index": int(df["day_index"].min()),
        "max_index": int(df["day_index"].max()),
        "mean_sales": float(df["total_sales"].mean()),
        "std_sales": float(df["total_sales"].std()) if len(df) > 1 else 0
    }
    joblib.dump(meta, os.path.join(MODEL_DIR, "sales_meta.pkl"))
    print("Sales model trained")
    return model


def train_demand_model():
    pipeline = [
        {"$unwind": "$items"},
        {"$group": {
            "_id": {
                "product": "$items.product",
                "year": {"$year": "$createdAt"},
                "month": {"$month": "$createdAt"},
                "day": {"$dayOfMonth": "$createdAt"}
            },
            "qty": {"$sum": "$items.quantitySold"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}}
    ]
    data = list(db.sales.aggregate(pipeline))
    if len(data) < 20:
        print("Not enough demand data for training")
        return None

    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["_id"].apply(lambda x: f"{x['year']}-{x['month']:02d}-{x['day']:02d}"))
    df["product"] = df["_id"].apply(lambda x: x["product"])
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["day_index"] = (df["date"] - df["date"].min()).dt.days

    product_groups = df.groupby("product")
    models = {}
    product_ids = []

    for pid, gdf in product_groups:
        gdf = gdf.sort_values("date")
        if len(gdf) < 5:
            continue
        X = gdf[["day_of_week", "month", "day_index"]].values
        y = gdf["qty"].values
        model = RandomForestRegressor(n_estimators=50, max_depth=5, random_state=42)
        model.fit(X, y)
        models[str(pid)] = model
        product_ids.append(str(pid))

    if models:
        joblib.dump(models, DEMAND_MODEL_PATH)
        joblib.dump(product_ids, DEMAND_PRODUCTS_PATH)
        print(f"Demand models trained for {len(models)} products")

    return models


def train_profit_model():
    pipeline = [
        {"$group": {
            "_id": {
                "year": {"$year": "$createdAt"},
                "month": {"$month": "$createdAt"}
            },
            "revenue": {"$sum": "$grandTotal"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    sales_data = list(db.sales.aggregate(pipeline))

    purchase_pipeline = [
        {"$group": {
            "_id": {
                "year": {"$year": "$createdAt"},
                "month": {"$month": "$createdAt"}
            },
            "cost": {"$sum": "$totalAmount"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    purchase_data = list(db.purchases.aggregate(purchase_pipeline))

    if len(sales_data) < 3:
        print("Not enough profit data for training")
        return None

    sales_df = pd.DataFrame(sales_data)
    sales_df["key"] = sales_df["_id"].apply(lambda x: f"{x['year']}-{x['month']:02d}")

    purchase_df = pd.DataFrame(purchase_data)
    purchase_df["key"] = purchase_df["_id"].apply(lambda x: f"{x['year']}-{x['month']:02d}")

    merged = sales_df.merge(purchase_df, on="key", how="left", suffixes=("_sales", "_purchase"))
    merged["cost"] = merged["cost"].fillna(0)
    merged["profit"] = merged["revenue"] - merged["cost"]
    merged["month_idx"] = range(len(merged))

    X = merged[["month_idx"]].values
    y_revenue = merged["revenue"].values
    y_profit = merged["profit"].values

    rev_model = LinearRegression()
    rev_model.fit(X, y_revenue)

    prof_model = LinearRegression()
    prof_model.fit(X, y_profit)

    joblib.dump(rev_model, os.path.join(MODEL_DIR, "revenue_model.pkl"))
    joblib.dump(prof_model, PROFIT_MODEL_PATH)
    joblib.dump({"last_idx": int(merged["month_idx"].max())}, os.path.join(MODEL_DIR, "profit_meta.pkl"))
    print("Profit model trained")
    return prof_model


def train_all():
    print("Training all models...")
    train_sales_model()
    train_demand_model()
    train_profit_model()
    print("Training complete")


if __name__ == "__main__":
    train_all()
