document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('graficaConsumo').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [
                {
                    label: 'Hoy (kWh)',
                    data: [1.2, 3.5, 4.8, 3.3, 2.1, 1.8],
                    backgroundColor: 'rgba(245, 166, 35, 0.8)',
                    borderRadius: 6,
                },
                {
                    label: 'Predicción mañana (kWh)',
                    data: [1.5, 3.8, 5.1, 3.0, 2.5, 2.0],
                    backgroundColor: 'rgba(167, 139, 250, 0.7)',
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { font: { size: 11 }, color: '#555' }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#888' } },
                y: { beginAtZero: true, ticks: { color: '#888', callback: v => v + ' kWh' } }
            }
        }
    });
});