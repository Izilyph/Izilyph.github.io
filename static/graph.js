function renderChart() {
    fetch('/chart/runes')
        .then(response => response.json())
        .then(chartConfig => {
            // Create a new Chart instance
            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, chartConfig);
        })
        .catch(error => console.error('Error fetching chart configuration:', error));
}

document.addEventListener('DOMContentLoaded', renderChart);