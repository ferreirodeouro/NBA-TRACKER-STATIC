const urlRecentNews = "../data/recent-news.json"; // Altere para o caminho correto
const urlTopNews = "../data/top-news.json"; // Altere para o caminho correto

// Função para buscar e exibir notícias recentes
async function displayRecentNews() {
  try {
    const response = await fetch(urlRecentNews); // Faz a requisição para o arquivo JSON
    const data = await response.json(); // Converte a resposta em JSON
    const headlines = data.recentNews; // Extrai o corpo das notícias

    // Verifica se o retorno é um array de manchetes
    if (Array.isArray(headlines)) {
      headlines.forEach((data) => {
        const newsHeadline = document.createElement("div"); // Cria um elemento div para exibir cada notícia
        newsHeadline.className = "news-headline"; // Define uma classe para estilização
        newsHeadline.style.cssText =
          "background: #575757d8; width: 60%; display: flex; justify-content: center; align-items: center; flex-direction: column; padding: 1rem; margin-top: 10px; border-radius: 16px;";

        // Define o conteúdo HTML da notícia com título e imagem
        newsHeadline.innerHTML = `
          <p class="news-content">${data.title}</p>
          <img src="${data.image}" alt="Imagem da notícia" class="headline-img">
          <a href="${data.link}" target="_blank" class="saiba-mais-link">Saiba mais</a>
        `;
        newsHeadline.style.backgroundImage =
          "linear-gradient(rgba(0,0,0,0.65), rgba(15,10,45,0.65))";

        // Adiciona o elemento de notícia ao contêiner principal da página
        document.getElementById("news-container").appendChild(newsHeadline);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar notícias recentes:", error);
  }
}

// Função para buscar e exibir as principais notícias da NBA
async function fetchTopNews() {
  try {
    const response = await fetch(urlTopNews); // Faz a requisição para o arquivo JSON
    const data = await response.json(); // Converte a resposta em JSON
    const noticias = data.topNews; // Extrai o array de notícias

    // Verifica se 'noticias' é um array
    if (Array.isArray(noticias)) {
      noticias.forEach((noticia) => {
        const newsCard = document.createElement("a"); // Cria um link para cada notícia
        newsCard.classList.add("top-news-link"); // Define a classe para estilização
        newsCard.href = noticia.link; // Adiciona o link da notícia
        newsCard.target = "_blank"; // Abre o link em uma nova aba

        // Define o conteúdo HTML do link com o título da notícia
        newsCard.innerHTML = `
          <div class="top-news-content">
            ${noticia.title}
          </div>
        `;

        // Adiciona o card de notícias ao contêiner principal da página
        document.getElementById("newsWrapper").appendChild(newsCard);
      });
    } else {
      console.error("A propriedade body não é um array:", noticias);
    }
  } catch (error) {
    console.error("Erro ao buscar principais notícias:", error);
  }
}

// Chama as funções para buscar as notícias ao carregar o script
displayRecentNews();
fetchTopNews();
