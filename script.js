const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('modal');
const animeTitle = document.getElementById('animeTitle');
const animeDetails = document.getElementById('animeDetails');
const animeTrailer = document.getElementById('animeTrailer');
const modalClose = document.getElementById('modalClose');
const recommendContent = document.getElementById("recommendContent");

let topAnimeList = [];

searchInput.addEventListener('keyup', async function (e) {
  const query = e.target.value.trim();
  if (query.length < 3) return;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
    const json = await res.json();
    displayResults(json.data);
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Error fetching results. Try again later.</p>`;
  }
});

async function showTopAnime() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
    const json = await res.json();
    topAnimeList = json.data;
    displayResults(topAnimeList);
    startAutoRecommend(); // Optional
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Unable to load top anime.</p>`;
  }
}

function displayResults(data) {
  resultsDiv.innerHTML = data.map(anime => `
    <div class="card" onclick='showDetails(${JSON.stringify(anime).replace(/'/g, "&#39;")})'>
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <div class="title">${anime.title}</div>
      <div class="info">Type: ${anime.type} • Episodes: ${anime.episodes}</div>
      <div class="info">Score: ⭐ ${anime.score || 'N/A'}</div>
      <div class="synopsis">${anime.synopsis || 'No synopsis available.'}</div>
    </div>
  `).join('');
}

function showDetails(anime) {
  animeTitle.textContent = anime.title;
  animeDetails.innerHTML = `
    <strong>Type:</strong> ${anime.type}<br>
    <strong>Episodes:</strong> ${anime.episodes}<br>
    <strong>Score:</strong> ${anime.score}<br>
    <strong>Status:</strong> ${anime.status}<br>
    <strong>Aired:</strong> ${anime.aired?.string || 'N/A'}<br><br>
    ${anime.synopsis || 'No synopsis available.'}
  `;

  if (anime.trailer && anime.trailer.embed_url) {
    animeTrailer.src = anime.trailer.embed_url;
    animeTrailer.style.display = "block";
  } else {
    animeTrailer.src = "";
    animeTrailer.style.display = "none";
  }

  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  animeTrailer.src = "";
}

function clearSearch() {
  searchInput.value = "";
  resultsDiv.innerHTML = "";
}

// Optional auto-recommend logic
function showRandomRecommendation() {
  if (!recommendContent || topAnimeList.length === 0) return;
  const anime = topAnimeList[Math.floor(Math.random() * topAnimeList.length)];
  recommendContent.innerHTML = `
    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
    <h3>${anime.title}</h3>
    <p><strong>Score:</strong> ⭐ ${anime.score || 'N/A'} • <strong>Episodes:</strong> ${anime.episodes || 'N/A'}</p>
  `;
}

function startAutoRecommend() {
  if (recommendContent) {
    showRandomRecommendation();
    setInterval(showRandomRecommendation, 5000);
  }
}

// Event listeners
document.getElementById("topAnime").addEventListener("click", showTopAnime);
document.getElementById("clearResults").addEventListener("click", clearSearch);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Load on start
window.onload = showTopAnime;
