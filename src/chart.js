import { createChart, CandlestickSeries, CrosshairMode, PriceScaleMode } from 'lightweight-charts';

const API_URL = 'https://api.dorostkar.dev/btcxau';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const container = document.getElementById('chart-container');
const logScaleToggle = document.getElementById('log-scale-toggle');

async function fetchBars() {
    if (!API_TOKEN) {
        throw new Error('VITE_API_TOKEN is not set');
    }

    const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    if (!response.ok) {
        throw new Error(`the API answered ${response.status} ${response.statusText}`);
    }

    const bars = await response.json();

    // the API sends unix milliseconds, lightweight-charts wants seconds
    return bars.map((bar) => ({ ...bar, time: bar.time / 1000 }));
}

if (container) {
    const chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
            background: { type: 'solid', color: '#131722' },
            textColor: '#d1d4dc',
        },
        grid: {
            vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
            horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
        },
        crosshair: {
            // the default is Magnet, which snaps the horizontal line to the hovered bar's close
            mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
            // the default 0.5 is wider than 12 years of daily bars can fit, so fitContent() would clip the early years
            minBarSpacing: 0.1,
        },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        // the ratio runs from 0.14 to 40.6, so two decimals would flatten the early years
        priceFormat: { type: 'price', precision: 4, minMove: 0.0001 },
    });

    function placeLogScaleToggle() {
        logScaleToggle.style.right = `${chart.priceScale('right').width() + 8}px`;
        logScaleToggle.style.bottom = `${chart.timeScale().height() + 8}px`;
    }

    placeLogScaleToggle();
    // fires whenever the axes relayout: on load, on resize, and when log's labels change the price scale's width
    chart.timeScale().subscribeSizeChange(placeLogScaleToggle);

    logScaleToggle.addEventListener('click', () => {
        // a click flips the scale, so the new mode is the opposite of what the button reports now
        const logarithmic = logScaleToggle.getAttribute('aria-pressed') !== 'true';

        logScaleToggle.setAttribute('aria-pressed', logarithmic);
        chart.priceScale('right').applyOptions({
            mode: logarithmic ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal,
        });
    });

    window.addEventListener('resize', () => {
        chart.resize(container.clientWidth, container.clientHeight);
    });

    fetchBars()
        .then((bars) => {
            candlestickSeries.setData(bars);
            chart.timeScale().fitContent();
        })
        .catch((error) => {
            console.error('Could not load the BTC/XAU ratio:', error);
        });
}
