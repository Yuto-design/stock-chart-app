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

let sma5Data = [];
let sma25Data = [];

function updateSmaVisibility() {
    const showSma5= document.getElementById("sma5Toggle").checked;
    const showSma25 = document.getElementById("sma25Toggle").checked;

    sma5Series.setData(showSma5 ? sma5Data : []);
    sma25Series.setData(showSma25 ? sma25Data : []);
}

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

    sma5Data= data.sma5;
    sma25Data= data.sma25;

    updateSmaVisibility();

    chart.timeScale().fitContent();
}

document.getElementById("load").addEventListener("click", loadStock);
document.getElementById("sma5Toggle").addEventListener("change", updateSmaVisibility);
document.getElementById("sma25Toggle").addEventListener("change", updateSmaVisibility);

loadStock();