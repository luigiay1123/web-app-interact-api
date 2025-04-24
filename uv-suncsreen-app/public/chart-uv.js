// public/chart-uv.js
import { Chart } from "chart.js";

export function renderUVChart(data) {
  const ctx = document.getElementById("uvChart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((item) =>
        new Date(item.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
      datasets: [
        {
          label: "UV Index",
          data: data.map((item) => item.uv),
          fill: true,
          borderColor: "orange",
          backgroundColor: "rgba(255,165,0,0.2)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}
