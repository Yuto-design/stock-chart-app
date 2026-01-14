const chartContainer = document.getElementById("chart");

const chart = LightweightCharts.createChart(chartContainer, {
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

const candleSeries = chart.addSeries(
    LightweightCharts.CandlestickSeries,
    {
        upColor: "rgba(22, 163, 74, 0.8)",
        downColor: "rgba(220, 38, 38, 0.8)",
        borderVisible: false,
        wickUpColor: "#16a34a",
        wickDownColor: "#dc2626",
    }
);

const closeLineSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 1, color: "#999" }
);

const smaSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 2, color: "orange" }
);

const emaSeries = chart.addSeries(
    LightweightCharts.LineSeries,
    { lineWidth: 2, color: "lime" }
);

const priceLine = candleSeries.createPriceLine({
    price: 0,
    color: "gray",
    lineWidth: 2,
    lineStyle: LightweightCharts.LineStyle.Solid,
    axisLabelVisible: true,
    title: "現在地"
});

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

    const lastCandle = data.candles[data.candles.length - 1];

    if (lastCandle) {
        priceLine.applyOptions({
            price: lastCandle.close
        });
    }

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

function resizeChart() {
    const container = document.getElementById("chart");
    chart.resize(container.clientWidth, container.clientHeight);
}

resizeChart();

window.addEventListener("resize", resizeChart);

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