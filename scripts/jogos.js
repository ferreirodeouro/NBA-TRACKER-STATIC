// Obtém os elementos do DOM onde os dados dos jogos serão exibidos
const scoresDiv = document.getElementById("scores");
const loadingDiv = document.getElementById("loading");
const displayDate = document.getElementById("title-dia");

async function loadGames() {
  try {
    console.log("Carregando jogos...");
    const response = await fetch(`../data/jogos.json`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log("Dados recebidos:", data);

    const todayGames = Object.values(data.body);
    console.log("Jogos de hoje:", todayGames);

    const today = new Date();
    displayDate.innerHTML = `Jogos do dia ${today.toLocaleDateString()}`;
    displayScores(todayGames, scoresDiv);
  } catch (error) {
    console.error("Erro ao carregar os jogos:", error);
    scoresDiv.innerHTML =
      "<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
  }
}

function convertToBrazilTime(gameTime) {
  // Remove espaços em branco e converte para minúsculas
  gameTime = gameTime.trim().toLowerCase();

  // Log da entrada para depuração
  console.log(`Entrada recebida: "${gameTime}"`);

  // Verifica se o formato está correto
  const regex = /^(\d{1,2}):(\d{2})(p)$/; // Aceita apenas 'p'
  const match = gameTime.match(regex);

  if (!match) {
    throw new Error("Formato inválido. Use 'hh:mm p'.");
  }

  let hours = parseInt(match[1]);
  const minutes = match[2];

  // Como sempre é PM, ajusta as horas
  if (hours < 12) {
    hours += 12; // Converte para 24 horas
  }

  // Adiciona 1 hora
  hours = (hours + 1) % 24; // Para evitar overflow (24:00)

  // Converte de volta para o formato 12 horas
  const newHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${newHours}:${minutes}pm`; // Saída sempre termina com 'pm'
}
function displayScores(games, container) {
  // Verifica se existem jogos
  if (!games || games.length === 0) {
    container.innerHTML = "<p>Nenhum jogo encontrado para esta data.</p>"; // Mensagem caso não haja jogos
    return; // Sai da função
  }

  // Busca os logotipos dos times a partir de um arquivo JSON
  fetch(`../data/times.json`)
    .then((response) => response.json()) // Converte a resposta para JSON
    .then((data) => {
      const teamsLogos = {}; // Objeto para armazenar os logotipos dos times
      const teamColors = {}; // Objeto para armazenar as cores dos times
      data.forEach((team) => {
        teamsLogos[team.Key] = team.WikipediaLogoUrl; // Armazena o logotipo do time
        if (team.PrimaryColor) {
          teamColors[team.Key] = `#${team.PrimaryColor}`; // Armazena a cor primária do time
        }
      });

      // Itera sobre cada jogo encontrado
      games.forEach((game) => {
        const gameDiv = document.createElement("div"); // Cria um novo elemento para o jogo
        gameDiv.classList.add("game"); // Adiciona a classe "game" ao elemento

        // Obtém informações dos times e pontos
        const homeTeam = game.home || "Desconhecido"; // Time da casa
        const awayTeam = game.away || "Desconhecido"; // Time visitante
        const homePts = game.homePts || "0"; // Pontos do time da casa
        const awayPts = game.awayPts || "0"; // Pontos do time visitante
        const status = game.gameStatus || "Não Iniciado"; // Status do jogo

        // Aqui é onde a conversão ocorre
        let time;
        try {
          time = convertToBrazilTime(game.gameTime); // Converte o horário recebido
          console.log(`Horário convertido: ${time}`); // Log correto do horário convertido
        } catch (error) {
          console.warn("Jogo sem horário válido:", game); // Log para verificar jogos sem horários válidos
          return; // Sai da iteração se o horário não for válido
        }

        // Define a cor do status do jogo
        let statusColor = "#ffffff"; // Cor padrão
        switch (status) {
          case "Aguardando Início":
            statusColor = "#ffffff"; // Cor para "Aguardando Início"
            break;
          case "Live - In Progress":
            statusColor = "#ff0000"; // Cor para "Live - In Progress"
            break;
          case "Finalizado":
            statusColor = "#00ff00"; // Cor para "Finalizado"
            break;
        }

        // Monta a estrutura HTML do jogo
        gameDiv.innerHTML = `
          <div class="score">
            <div class="team-container">
              <div class="detail">
                <img src="${teamsLogos[awayTeam]}" alt="${awayTeam}" class="team-logo"> <!-- Logotipo do time visitante -->
                <span class="team-name">${awayTeam}</span> <!-- Nome do time visitante -->
              </div>
              <span class="points">${awayPts}</span> <!-- Pontos do time visitante -->
              <div style="display:flex;justify-content:center;align-items:center;flex-direction:column; gap:2vh;">
                <span style="font-size: .5vw;">${time}</span> <!-- Horário formatado -->
                <span style="font-size: 1.8vw;">VS</span> <!-- Versus -->
                <span style="color: ${statusColor}; font-weight: bold;">${status}</span> <!-- Status do jogo -->
              </div>
              <span class="points">${homePts}</span> <!-- Pontos do time da casa -->
              <div class="detail">
                <img src="${teamsLogos[homeTeam]}" alt="${homeTeam}" class="team-logo"> <!-- Logotipo do time da casa -->
                <span class="team-name">${homeTeam}</span> <!-- Nome do time da casa -->
              </div>
            </div>
          </div>`;

        // Adiciona o elemento do jogo ao contêiner
        container.appendChild(gameDiv);

        const primaryColorHome = teamColors[homeTeam]; // Cor primária do time da casa
        const primaryColorAway = teamColors[awayTeam]; // Cor primária do time visitante

        // Adiciona efeito de mouse sobre o jogo
        gameDiv.addEventListener("mouseover", function () {
          gameDiv.style.cursor = "pointer"; // Muda o cursor ao passar o mouse
          // Aplica um gradiente de fundo baseado nas cores dos times
          gameDiv.style.backgroundImage = `linear-gradient(90deg, rgba(${hexToRgb(primaryColorAway || "#575757")}, 0.6), rgba(${hexToRgb(primaryColorHome || "#575757")}, 0.6))`;
          gameDiv.style.color = "#fff"; // Altera a cor do texto
          gameDiv.style.transition =
            "background-image 1s ease-in, color 1s ease-in"; // Efeito de transição suave
        });

        // Remove o efeito ao sair com o mouse
        gameDiv.addEventListener("mouseleave", function () {
          gameDiv.style.backgroundImage = ""; // Remove o gradiente de fundo
          gameDiv.style.color = ""; // Restaura a cor do texto
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar logotipos dos times:", error); // Mensagem de erro se falhar
    });
}

// Função para converter cor hexadecimal em RGB
function hexToRgb(hex) {
  let r = 0,
    g = 0,
    b = 0;

  // Remove o símbolo '#' se presente
  hex = hex.replace(/^#/, "");

  // Converte para RGB
  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16); // Obtém o valor vermelho
    g = parseInt(hex.substring(2, 4), 16); // Obtém o valor verde
    b = parseInt(hex.substring(4, 6), 16); // Obtém o valor azul
  }

  return [r, g, b]; // Retorna o valor RGB
}

// Chama a função para carregar os jogos ao carregar a página
loadGames();
