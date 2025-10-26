// Dados mockados para simulação (voos fictícios para os próximos 6 meses)
const mockFlights = [];

// Função para gerar dados mockados
function generateMockData() {
  const airlines = ["LATAM", "Gol", "Azul", "American Airlines", "Delta"];
  const today = new Date();
  for (let i = 0; i < 50; i++) {
    // 50 voos simulados
    const departureDate = new Date(today);
    departureDate.setDate(today.getDate() + Math.floor(Math.random() * 180)); // Próximos 6 meses
    const price = Math.floor(Math.random() * 2000) + 500; // Preços entre 500 e 2500
    mockFlights.push({
      departure: "GRU", // Exemplo fixo; em produção, use input
      destination: "JFK", // Exemplo fixo
      date: departureDate.toISOString().split("T")[0],
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      price: price,
    });
  }
}

// Chama a geração de dados ao carregar
generateMockData();

// Função para buscar e filtrar voos
function searchFlights(departure, destination, depDate, retDate, airline) {
  let results = mockFlights.filter((flight) => {
    return (
      (!departure ||
        flight.departure.toLowerCase().includes(departure.toLowerCase())) &&
      (!destination ||
        flight.destination.toLowerCase().includes(destination.toLowerCase())) &&
      (!depDate || flight.date >= depDate) &&
      (!retDate || flight.date <= retDate) &&
      (!airline || flight.airline === airline)
    );
  });
  // Ordena por preço (melhores preços primeiro)
  results.sort((a, b) => a.price - b.price);
  return results;
}

// Função para exibir resultados
function displayResults(results) {
  const container = document.getElementById("results-container");
  if (results.length === 0) {
    container.innerHTML =
      "<p>Nenhum voo encontrado. Tente ajustar os filtros.</p>";
    return;
  }

  let html =
    "<table><thead><tr><th>Data</th><th>Empresa</th><th>Preço (R$)</th></tr></thead><tbody>";
  results.forEach((flight) => {
    html += `<tr><td>${flight.date}</td><td>${flight.airline}</td><td>R$ ${flight.price}</td></tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

// Evento de submissão do formulário
document
  .getElementById("flight-search")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const departure = document.getElementById("departure").value;
    const destination = document.getElementById("destination").value;
    const depDate = document.getElementById("departure-date").value;
    const retDate = document.getElementById("return-date").value;
    const airline = document.getElementById("airline").value;

    const results = searchFlights(
      departure,
      destination,
      depDate,
      retDate,
      airline
    );
    displayResults(results);
  });
