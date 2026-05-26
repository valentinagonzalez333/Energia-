// Protect pasado a script.js para evitar repetición en cada página

const ctx = document.getElementById('grafica');

if (sessionStorage.getItem("sesion") !== "activa") {
  window.location.replace("login.html");
}

window.addEventListener("pageshow", function(e) {
  if (e.persisted || sessionStorage.getItem("sesion") !== "activa") {
    window.location.replace("login.html");
  }
});

function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  window.location.replace("login.html");
}

new Chart(ctx, {
    type: 'line',

    data: {
        labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'],

        datasets: [{
            label: 'Consumo Energético',

            data: [12, 19, 8, 15, 10, 22],

            borderColor: '#ff8c00',

            backgroundColor: 'rgba(255,140,0,0.2)',

            tension: 0.4,

            fill: true
        }]
    },

    options: {

        responsive: true,

        plugins: {
            legend: {
                labels: {
                    color: '#131212'
                }
            }
        },

        scales: {

            x: {
                ticks: {
                    color: 'white'
                }
            },

            y: {
                ticks: {
                    color: 'white'
                }
            }
        }
    }
});