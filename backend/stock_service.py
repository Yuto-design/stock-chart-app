import yfinance as yf
import pandas as pd

def get_stock_data(
    symbol: str,
    period: str,
    sma_period: int,
    ema_period: int,
):
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period)

    if df.empty:
        return None

    df.reset_index(inplace=True)

    sma_col = f"sma_{sma_period}"
    ema_col = f"ema_{ema_period}"

    df[sma_col] = df["Close"].rolling(window=sma_period).mean()
    df[ema_col] = df["Close"].ewm(span=ema_period, adjust=False).mean()

    candles = []
    sma_data = []
    ema_data = []

    for _, row in df.iterrows():
        time = row["Date"].strftime("%Y-%m-%d")

        candles.append({
            "time": time,
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
        })

        if not pd.isna(row[sma_col]):
            sma_data.append({
                "time": time,
                "value": round(row[sma_col], 2),
            })

        if not pd.isna(row[ema_col]):
            ema_data.append({
                "time": time,
                "value": round(row[ema_col], 2),
            })

    return {
        "candles": candles,
        "sma": sma_data,
        "ema": ema_data,
    }
