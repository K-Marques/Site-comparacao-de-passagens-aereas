// Lista de aeroportos mockados (para sugestões)
const airports = [
    { code: 'GRU', city: 'São Paulo', fullName: 'São Paulo (GRU)' },
    { code: 'CGH', city: 'São Paulo', fullName: 'São Paulo Congonhas (CGH)' },
    { code: 'VCP', city: 'São Paulo', fullName: 'São Paulo Viracopos (VCP)' },
    { code: 'JFK', city: 'Nova York', fullName: 'Nova York (JFK)' },
    { code: 'LAX', city: 'Los Angeles', fullName: 'Los Angeles (LAX)' },
    { code: 'MIA', city: 'Miami', fullName: 'Miami (MIA)' },
    { code: 'FRA', city: 'Frankfurt', fullName: 'Frankfurt (FRA)' },
    { code: 'CDG', city: 'Paris', fullName: 'Paris (CDG)' },
    { code: 'LHR', city: 'Londres', fullName: 'Londres (LHR)' },
    { code: 'MAD', city: 'Madrid', fullName: 'Madrid (MAD)' },
    { code: 'FCO', city: 'Roma', fullName: 'Roma (FCO)' },
    { code: 'AMS', city: 'Amsterdã', fullName: 'Amsterdã (AMS)' },
    { code: 'SYD', city: 'Sydney', fullName: 'Sydney (SYD)' },
    { code: 'NRT', city: 'Tóquio', fullName: 'Tóquio (NRT)' },
    { code: 'HND', city: 'Tóquio', fullName: 'Tóquio (HND)' },
    { code: 'ICN', city: 'Seul', fullName: 'Seul (ICN)' },
];

// Empresas aéreas mockadas
const airlines = ['LATAM', 'Gol', 'Azul', 'American Airlines', 'Delta'];

// Sugestões de aeroportos
function showSuggestions(input, suggestionsDiv) {
    const query = input.value.toLowerCase();
    suggestionsDiv.innerHTML = '';
    if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    const filtered = airports.filter(a =>
        a.city.toLowerCase().includes(query) ||
        a.fullName.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query)
    );
    filtered.forEach(a => {
        const div = document.createElement('div');
        div.textContent = a.fullName;
        div.addEventListener('click', () => {
            input.value = a.fullName;
            suggestionsDiv.style.display = 'none';
        });
        suggestionsDiv.appendChild(div);
    });
    suggestionsDiv.style.display = filtered.length ? 'block' : 'none';
}

// Ocultar sugestões ao clicar fora
document.addEventListener('click', e => {
    if (!e.target.closest('.form-group')) {
        document.querySelectorAll('.suggestions').forEach(d => d.style.display = 'none');
    }
});

// Event listeners para inputs
document.getElementById('departure').addEventListener('input', function() {
    showSuggestions(this, document.getElementById('departure-suggestions'));
});
document.getElementById('destination').addEventListener('input', function() {
    showSuggestions(this, document.getElementById('destination-suggestions'));
});

// Gerar voos simulados
function generateMockFlights(origin, destination, depDate, retDate) {
    const results = [];
    const depPrice = Math.floor(Math.random() * 2000) + 500;
    const retPrice = Math.floor(Math.random() * 2000) + 500;
    const depAirline = airlines[Math.floor(Math.random() * airlines.length)];
    const retAirline = airlines[Math.floor(Math.random() * airlines.length)];

    // Ida
    results.push({
        date: depDate,
        airline: depAirline,
        price: depPrice,
        origin: origin,
        destination: destination
    });

    // Volta (se houver)
    if (retDate) {
        results.push({
            date: retDate,
            airline: retAirline,
            price: retPrice,
            origin: destination,
            destination: origin
        });
    }

    // Ordena por preço
    results.sort((a, b) => a.price - b.price);
    return results;
}

// Exibir resultados
function displayResults(results) {
    const container = document.getElementById('results-container');
    if (results.length === 0) {
        container.innerHTML = '<p>Nenhum voo encontrado.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Data</th><th>Origem → Destino</th><th>Empresa</th><th>Preço (R$)</th></tr></thead><tbody>';
    results.forEach(flight => {
        html += `<tr>
            <td>${flight.date}</td>
            <td>${flight.origin} → ${flight.destination}</td>
            <td>${flight.airline}</td>
            <td>R$ ${flight.price}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Evento de submit
document.getElementById('flight-search').addEventListener('submit', e => {
    e.preventDefault();
    const departure = document.getElementById('departure').value.split('(')[1]?.split(')')[0] || '';
    const destination = document.getElementById('destination').value.split('(')[1]?.split(')')[0] || '';
    const depDate = document.getElementById('departure-date').value;
    const retDate = document.getElementById('return-date').value;

    if (!departure || !destination) {
        alert('Informe aeroportos válidos!');
        return;
    }

    const results = generateMockFlights(departure, destination, depDate, retDate);
    displayResults(results);
});
