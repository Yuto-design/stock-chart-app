import yfinance as yf
import pandas as pd

def calculate_sma(series: pd.Series, window: int):
    return series.rolling(window=window).mean()

def get_stock_data(symbol: str, period: str = "1y"):
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period)

    if df.empty:
        return None

    df.reset_index(inplace=True)

    df["sma5"] = calculate_sma(df["Close"], 5)
    df["sma25"] = calculate_sma(df["Close"], 25)

    candles = []
    sma5 = []
    sma25 = []

    for _, row in df.iterrows():
        time = row["Date"].strftime("%Y-%m-%d")

        candles.append({
            "time": time,
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
        })

        if not pd.isna(row["sma5"]):
            sma5.append({
                "time": time,
                "value": round(row["sma5"], 2),
            })

        if not pd.isna(row["sma25"]):
            sma25.append({
                "time": time,
                "value": round(row["sma25"], 2),
            })

    return {
        "candles": candles,
        "sma5": sma5,
        "sma25": sma25
    }