const chartContainer = document.getElementById("chart");

const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
        backgroundColor: {color: "#ffffff"},
        textColor: "#333",
    },
    grid: {
        vertLines: {color: "#eee"},
        horzLines: {color: "#eee"},
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
});

const candleSeries = chart.addSeries(
    LightweightCharts.CandlestickSeries
);

const closeLineSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    {
        lineWidth: 2,
    }
);

const sma5Series = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 2, color: "red" }
);

const sma25Series = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 2, color: "green" }
);

async function loadStock() {
    const symbol = document.getElementById("symbol").value;
    const period = document.getElementById("period").value;

    const res = await fetch(
        `http://127.0.0.1:8000/api/stock?symbol=${symbol}&period=${period}`
    );

    if (!res.ok) {
        alert("データ取得に失敗しました");
        return;
    }

    const data = await res.json();

    candleSeries.setData(data.candles);
    closeLineSeries.setData(
        data.candles.map(c => ({
        time: c.time,
        value: c.close,
    })));

    sma5Series.setData(data.sma5);
    sma25Series.setData(data.sma25);

    chart.timeScale().fitContent();
}

document.getElementById("load").addEventListener("click", loadStock);
loadStock();