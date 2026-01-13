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

const lineSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    {
        lineWidth: 2,
    }
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

    const closeLine = data.candles.map(c => ({
        time: c.time,
        value: c.close,
    }));

    lineSeries.setData(closeLiine);

    chart.timeScale().fitContent();
}

document.getElementById("load").addEventListener("click", loadStock);
loadStock();