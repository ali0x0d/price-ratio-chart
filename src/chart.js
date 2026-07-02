import { createChart, CandlestickSeries } from 'lightweight-charts';

const container = document.getElementById('chart-container');

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
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
            timeVisible: true,
        },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    });

    const data = [
        { time: '2026-06-15', open: 92.00,  high: 96.00,  low: 91.50,  close: 95.50  },
        { time: '2026-06-16', open: 95.50,  high: 96.20,  low: 93.50,  close: 94.20  },
        { time: '2026-06-17', open: 94.20,  high: 97.00,  low: 93.00,  close: 96.00  },
        { time: '2026-06-18', open: 96.00,  high: 99.50,  low: 95.20,  close: 98.50  },
        { time: '2026-06-19', open: 98.50,  high: 101.20, low: 97.00,  close: 100.00 },
        { time: '2026-06-20', open: 100.00, high: 105.50, low: 98.20,  close: 103.40 },
        { time: '2026-06-21', open: 103.40, high: 108.00, low: 102.10, close: 107.20 },
        { time: '2026-06-22', open: 107.20, high: 112.50, low: 106.00, close: 110.10 },
        { time: '2026-06-23', open: 110.10, high: 111.30, low: 105.20, close: 106.50 },
        { time: '2026-06-24', open: 106.50, high: 109.80, low: 104.00, close: 108.90 },
    ];

    candlestickSeries.setData(data);
    chart.timeScale().fitContent();

    window.addEventListener('resize', () => {
        chart.resize(container.clientWidth, container.clientHeight);
    });
}