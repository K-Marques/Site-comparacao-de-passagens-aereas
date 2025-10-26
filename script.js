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
    // ...adicione mais conforme precisar
];

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

// Busca na Fly Scraper API
async function searchFlightsAPI(origin, destination, depDate, retDate, adults = 1) {
    const url = 'https://fly-scraper.p.rapidapi.com/flights/search-detail';
    const data = {
        itineraryId: "",
        sessionId: "session-" + Date.now(),
        market: "US",
        locale: "en-US",
        currency: "USD",
        adults: adults,
        cabinClass: "economy",
        flights: [{ originIata: origin, destinationIata: destination, departDate: depDate }]
    };
    if (retDate) {
        data.flights.push({ originIata: destination, destinationIata: origin, departDate: retDate });
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'fly-scraper.p.rapidapi.com',
                'x-rapidapi-key': '65909d936dmsh6fa8626252d7106p129580jsn5027b0b29f67'
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        displayResultsAPI(result);
    } catch (err) {
        console.error(err);
        alert('Erro ao buscar voos.');
    }
}

// Exibir resultados
function displayResultsAPI(apiData) {
    const container = document.getElementById('results-container');
    if (!apiData || !apiData.itineraries || apiData.itineraries.length === 0) {
        container.innerHTML = '<p>Nenhum voo encontrado.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Data</th><th>Empresa</th><th>Preço (USD)</th></tr></thead><tbody>';
    apiData.itineraries.forEach(it => {
        const flight = it.flights[0];
        html += `<tr>
            <td>${flight.departDate}</td>
            <td>${flight.airlineName}</td>
            <td>$${it.price.totalAmount}</td>
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

    searchFlightsAPI(departure, destination, depDate, retDate);
});
