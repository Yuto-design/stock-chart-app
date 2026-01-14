const chartContainer = document.getElementById("chart");

const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
        backgroundColor: { color: "#ffffff" },
        textColor: "#333",
    },
    grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
});

const candleSeries = chart.addSeries(LightweightCharts.CandlestickSeries);

const closeLineSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 1, color: "#999" }
);

const smaSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 2, color: "red" }
);

const emaSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 2, color: "blue" }
);

let smaData = [];
let emaData = [];

function updateIndicatorVisibility() {
    const showSma = document.getElementById("smaToggle").checked;
    const showEma = document.getElementById("emaToggle").checked;

    smaSeries.setData(showSma ? smaData : []);
    emaSeries.setData(showEma ? emaData : []);
}

function updateLegend() {
    const smaPeriod = document.getElementById("smaPeriod").value;
    const emaPeriod = document.getElementById("emaPeriod").value;

    document.getElementById("legend-sma-period").textContent = smaPeriod;
    document.getElementById("legend-ema-period").textContent = emaPeriod;

    document.getElementById("legend-sma").style.display =
        document.getElementById("smaToggle").checked ? "inline" : "none";

    document.getElementById("legend-ema").style.display =
        document.getElementById("emaToggle").checked ? "inline" : "none";
}


async function loadStock() {
    const symbol = document.getElementById("symbol").value;
    const period = document.getElementById("period").value;
    const smaPeriod = document.getElementById("smaPeriod").value;
    const emaPeriod = document.getElementById("emaPeriod").value;

    const res = await fetch(
        `http://127.0.0.1:8000/api/stock` +
        `?symbol=${symbol}` +
        `&period=${period}` +
        `&sma_period=${smaPeriod}` +
        `&ema_period=${emaPeriod}`
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
        }))
    );

    smaData = data.sma;
    emaData = data.ema;

    updateIndicatorVisibility();
    chart.timeScale().fitContent();
}

document.getElementById("load").addEventListener("click", loadStock);
document.getElementById("smaToggle").addEventListener("change", updateIndicatorVisibility);
document.getElementById("emaToggle").addEventListener("change", updateIndicatorVisibility);

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("change", () => {
        loadStock();
        updateLegend();
    });
});

document.getElementById("smaToggle")
    .addEventListener("change", () => {
        updateIndicatorVisibility();
        updateLegend();
    });

document.getElementById("emaToggle")
    .addEventListener("change", () => {
        updateIndicatorVisibility();
        updateLegend();
    });

loadStock();
updateLegend();