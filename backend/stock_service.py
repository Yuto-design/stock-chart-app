import yfinance as yf
import pandas as pd

def get_stock_data(symbol: str, period: str = "1y"):
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period)

    if df.empty:
        return None

    df.reset_index(inplace=True)

    candles = []
    for _, row in df.iterrows():
        candles.append({
            "time": row["Date"].strftime("%Y-%m-%d"),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
        })

    return candles