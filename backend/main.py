from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.stock_service import get_stock_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stock")
def read_stock(symbol: str, period: str = "1y"):
    data = get_stock_data(symbol, period)

    if data is None:
        raise HTTPException(status_code=404, detail="Stock data not found")

    return {
        "symbol": symbol,
        "period": period,
        "candles": data
    }