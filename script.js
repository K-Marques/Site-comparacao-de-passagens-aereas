// Lista de aeroportos mockados (códigos IATA, cidades e nomes completos)
const airports = [
    { code: 'GRU', city: 'São Paulo', fullName: 'São Paulo (Guarulhos - GRU)' },
    { code: 'CGH', city: 'São Paulo', fullName: 'São Paulo Congonhas (CGH)' },
    { code: 'VCP', city: 'São Paulo', fullName: 'São Paulo Viracopos (VCP)' },
    { code: 'JFK', city: 'Nova York', fullName: 'Nova York (John F. Kennedy - JFK)' },
    { code: 'LAX', city: 'Los Angeles', fullName: 'Los Angeles (LAX)' },
    { code: 'MIA', city: 'Miami', fullName: 'Miami (MIA)' },
    { code: 'FRA', city: 'Frankfurt', fullName: 'Frankfurt (FRA)' },
    { code: 'CDG', city: 'Paris', fullName: 'Paris (Charles de Gaulle - CDG)' },
    { code: 'LHR', city: 'Londres', fullName: 'Londres (Heathrow - LHR)' },
    { code: 'MAD', city: 'Madrid', fullName: 'Madrid (MAD)' },
    { code: 'FCO', city: 'Roma', fullName: 'Roma (Fiumicino - FCO)' },
    { code: 'AMS', city: 'Amsterdã', fullName: 'Amsterdã (Schiphol - AMS)' },
    { code: 'ZRH', city: 'Zurique', fullName: 'Zurique (ZRH)' },
    { code: 'IST', city: 'Istambul', fullName: 'Istambul (IST)' },
    { code: 'DXB', city: 'Dubai', fullName: 'Dubai (DXB)' },
    { code: 'NRT', city: 'Tóquio', fullName: 'Tóquio (Narita - NRT)' },
    { code: 'HND', city: 'Tóquio', fullName: 'Tóquio (Haneda - HND)' },
    { code: 'ICN', city: 'Seul', fullName: 'Seul (Incheon - ICN)' },
    { code: 'SIN', city: 'Singapura', fullName: 'Singapura (Changi - SIN)' },
    { code: 'SYD', city: 'Sydney', fullName: 'Sydney (SYD)' },
    { code: 'BKK', city: 'Bangkok', fullName: 'Bangkok (Suvarnabhumi - BKK)' },
    { code: 'HKG', city: 'Hong Kong', fullName: 'Hong Kong (HKG)' },
    { code: 'PEK', city: 'Pequim', fullName: 'Pequim (Capital - PEK)' },
    { code: 'PVG', city: 'Xangai', fullName: 'Xangai (Pudong - PVG)' },
    { code: 'CAN', city: 'Guangzhou', fullName: 'Guangzhou (Baiyun - CAN)' },
    { code: 'DEL', city: 'Delhi', fullName: 'Delhi (Indira Gandhi - DEL)' },
    { code: 'BOM', city: 'Mumbai', fullName: 'Mumbai (Chhatrapati Shivaji - BOM)' },
    { code: 'JNB', city: 'Joanesburgo', fullName: 'Joanesburgo (O.R. Tambo - JNB)' },
    { code: 'CAI', city: 'Cairo', fullName: 'Cairo (CAI)' },
    { code: 'ADD', city: 'Addis Ababa', fullName: 'Addis Ababa (Bole - ADD)' },
    // Adicione mais aeroportos conforme necessário
];

// Dados mockados para simulação (voos fictícios para os próximos 6 meses)
const mockFlights = [];

// Função para gerar dados mockados
function generateMockData() {
    const airlines = ['LATAM', 'Gol', 'Azul', 'American Airlines', 'Delta'];
    const today = new Date();
    for (let i = 0; i < 50; i++) {  // 50 voos simulados
        const departureDate = new Date(today);
        departureDate.setDate(today.getDate() + Math.floor(Math.random() * 180));  // Próximos 6 meses
        const price = Math.floor(Math.random() * 2000) + 500;  // Preços entre 500 e 2500
        mockFlights.push({
            departure: 'GRU',  // Exemplo fixo; em produção, use input
            destination: 'JFK',  // Exemplo fixo
            date: departureDate.toISOString().split('T')[0],
            airline: airlines[Math.floor(Math.random() * airlines.length)],
            price: price
        });
    }
}

// Chama a geração de dados ao carregar
generateMockData();

// Função para mostrar sugestões de aeroportos
function showSuggestions(input, suggestionsDiv) {
    const query = input.value.toLowerCase();
    suggestionsDiv.innerHTML = '';
    if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    const filtered = airports.filter(airport =>
        airport.city.toLowerCase().includes(query) ||
        airport.fullName.toLowerCase().includes(query) ||
        airport.code.toLowerCase().includes(query)
    );
    if (filtered.length > 0) {
        filtered.forEach(airport => {
            const div = document.createElement('div');
            div.textContent = airport.fullName;
            div.addEventListener('click', () => {
                input.value = airport.fullName;
                suggestionsDiv.style.display = 'none';
            });
            suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.style.display = 'none';
    }
}

// Função para ocultar sugestões ao clicar fora
function hideSuggestions() {
    document.querySelectorAll('.suggestions').forEach(div => div.style.display = 'none');
}

// Adicionar event listeners para sugestões
document.getElementById('departure').addEventListener('input', function() {
    showSuggestions(this, document.getElementById('departure-suggestions'));
});
document.getElementById('destination').addEventListener('input', function() {
    showSuggestions(this, document.getElementById('destination-suggestions'));
});

// Ocultar sugestões ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('.form-group')) {
        hideSuggestions();
    }
});

// Função para buscar e filtrar voos
function searchFlights(departure, destination, depDate, retDate, airline) {
    let results = mockFlights.filter(flight => {
        return (!departure || flight.departure.toLowerCase().includes(departure.toLowerCase())) &&
               (!destination || flight.destination.toLowerCase().includes(destination.toLowerCase())) &&
               (!depDate || flight.date >= depDate) &&
               (!retDate || flight.date <= retDate) &&
               (!airline || flight.airline === airline);
    });
    // Ordena por preço (melhores preços primeiro)
    results.sort((a, b) => a.price - b.price);
    return results;
}

// Função para exibir resultados
function displayResults(results) {
    const container = document.getElementById('results-container');
    if (results.length === 0) {
        container.innerHTML = '<p>Nenhum voo encontrado. Tente ajustar os filtros.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Data</th><th>Empresa</th><th>Preço (R$)</th></tr></thead><tbody>';
    results.forEach(flight => {
        html += `<tr><td>${flight.date}</td><td>${flight.airline}</td><td>R$ ${flight.price}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Evento de submissão do formulário
document.getElementById('flight-search').addEventListener('submit', function(e) {
    e.preventDefault();
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    const depDate = document.getElementById('departure-date').value;
    const retDate = document.getElementById('return-date').value;
    const airline = document.getElementById('airline').value;

    const results = searchFlights(departure, destination, depDate, retDate, airline);
    displayResults(results);
});
