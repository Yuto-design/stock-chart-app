# Stock Chart App
FastAPI + yfinance を使った **株価チャート可視化アプリ** です。  
ローソク足チャートに **SMA / EMA** を重ねて表示できます。

---

## 機能
- ローソク足チャート表示
- 終値ライン表示
- SMA（単純移動平均）
- EMA（指数平滑移動平均）
- SMA / EMA の期間を UI から変更
- SMA / EMA の表示切り替え

> [!TIP]
> SMA（単純移動平均）：一定期間の価格の平均を計算し、その値を線で結んだもの
> EMA（指数平滑移動平均）：直近の価格に重みを置いて計算される移動平均

---

## 技術スタック

### フロントエンド
- HTML / CSS
- JavaScript
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)

### バックエンド
- Python
- FastAPI
- yfinance
- pandas

---

## ディレクトリ構成
<pre><code>
stock-chart-app/
├─ backend/
│  ├─ main.py
│  ├─ stock_service.py
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
└─README.md
</code></pre>

---

## セットアップ

1. Python 環境構築
<pre><code>
pip install fastapi uvicorn yfinance pandas
</code></pre>

2. バックエンド起動
<pre><code>
cd backend
uvicorn main:app --reload
</code></pre>
起動後：
<pre><code>
http://127.0.0.1:8000
</code></pre>

3. フロントエンド起動
- `frontend/index.html` をブラウザで開く
または
- VSCode の Live Server を使用

## API仕様
### エンドポイント
<pre></code>
GET /api/stock
</code></pre>

### クエリパラメータ
|パラメータ|説明|例|
|----|----|----|
|`symbol`|銘柄コード|AAPL|
|`period`|期間|6mo|
|`sma_period`|SMA期間|25|
|`ema_period`|EMA期間|25|

### レスポンス例
<pre><code>
{
  "candles": [
    { "time": "2024-01-01", "open": 100, "high": 105, "low": 98, "close": 102 }
  ],
  "sma": [
    { "time": "2024-01-10", "value": 101.2 }
  ],
  "ema": [
    { "time": "2024-01-10", "value": 101.8 }
  ]
}
</code></pre>

## UI操作方法
- 銘柄コードを入力（例：`AAPL`, `MSFT`, `TSLA`）
- 期間を選択
- SMA / EMA の期間を数値入力
- チェックボックスで表示切替
- 「表示」ボタンで更新

> [!Warning]
> - `yfinance` は**リアルタイムではありません**
> - 無効な銘柄の場合、データが返らないことがあります
> - API制限がかかる場合があります