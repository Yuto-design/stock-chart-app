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
def read_stock(
    symbol: str,
    period: str = "6mo",
    sma_period: int = 25,
    ema_period: int = 25,
):
    return get_stock_data(
        symbol,
        period,
        sma_period,
        ema_period,
    )
