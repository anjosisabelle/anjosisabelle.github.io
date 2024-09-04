let dataFilter = '';
let regiaoFilter = '';
let mortalidadeFilter = '';

console.log('Script loaded successfully');
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('dataFilter').addEventListener('change', function (event) {
        dataFilter = event.target.value;
        showDashboard();
    });

    document.getElementById('regiaoFilter').addEventListener('change', function (event) {
        regiaoFilter = event.target.value;
        showDashboard();
    });

    document.getElementById('mortalidadeFilter').addEventListener('change', function (event) {
        mortalidadeFilter = event.target.value;
        showDashboard();
    });
    showDashboard();
});

async function loadData() {
    console.log('Fetching data from API...');
    const apiUrl = 'https://dados.saude.go.gov.br/api/3/action/datastore_search?resource_id=5a4b5bbe-98c6-4d7c-8aed-d5de162dc605&limit=100';
    
    try {
        console.log('API URL:', apiUrl);
        const response = await fetch(apiUrl, { method: 'GET' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        console.log('Data fetched successfully');
        const data = await response.json();
        return data.result.records;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function showDashboard() {
    console.log('showDashboard function called');
    console.log('Loading data...');
    const data = await loadData();
    console.log('Data loaded:', data);
    // Log dos valores dos filtros
    console.log('Data Filter:', dataFilter);
    console.log('Região Filter:', regiaoFilter);
    console.log('Mortalidade Filter:', mortalidadeFilter);

    // Aplicar os filtros aos dados
    const filteredData = data.filter(item => {
        const dataMatch = !dataFilter || item.dt_diag_sintoma === dataFilter;
        const regiaoMatch = !regiaoFilter || item.dmun_regiao_saudex === regiaoFilter;
        const mortalidadeMatch = !mortalidadeFilter || item.dsit_situacao === mortalidadeFilter;
        return dataMatch && regiaoMatch && mortalidadeMatch;
    });

    // Log dos dados filtrados
    console.log('Filtered Data:', filteredData);

    // Exemplo de como exibir os dados filtrados em um gráfico de barras usando Chart.js
    const ctx = document.getElementById('chart1').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: filteredData.map(item => item.nome), // Supondo que 'nome' seja um campo nos dados
            datasets: [{
                label: 'Exemplo de Dados',
                data: filteredData.map(item => item.valor), // Supondo que 'valor' seja um campo nos dados
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
