import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import train
import predict

app = FastAPI(title="AI/ML Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    model_dir = os.path.join(os.path.dirname(__file__), "models")
    if not os.path.exists(model_dir) or len(os.listdir(model_dir)) == 0:
        print("No models found, training on startup...")
        train.train_all()
    else:
        print("Models found, skipping training")


@app.get("/health")
def health():
    return {"status": "ok", "service": "AI/ML Analytics"}


@app.post("/train")
def force_train():
    train.train_all()
    return {"message": "Training complete"}


@app.get("/sales-prediction")
def sales_prediction():
    tomorrow = predict.predict_tomorrow()
    weekly = predict.predict_weekly()
    monthly = predict.predict_monthly()
    if isinstance(tomorrow, dict) and "error" in tomorrow:
        return JSONResponse(status_code=503, content=tomorrow)
    return {
        "tomorrow": tomorrow,
        "weekly": weekly if isinstance(weekly, list) else [],
        "monthly": monthly if isinstance(monthly, list) else []
    }


@app.get("/demand-forecast")
def demand_forecast():
    result = predict.predict_demand()
    if isinstance(result, dict) and "error" in result:
        return JSONResponse(status_code=503, content=result)
    return {"products": result}


@app.get("/restock")
def restock():
    return {"recommendations": predict.recommend_restock()}


@app.get("/stockout")
def stockout():
    return {"products": predict.predict_stockout()}


@app.get("/fast-moving")
def fast_moving():
    return predict.classify_movement()


@app.get("/profit")
def profit():
    result = predict.predict_profit()
    if isinstance(result, dict) and "error" in result:
        return JSONResponse(status_code=503, content=result)
    return result


@app.get("/supplier")
def supplier():
    return {"suppliers": predict.recommend_supplier()}


@app.get("/dashboard")
def dashboard():
    return predict.get_dashboard()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
