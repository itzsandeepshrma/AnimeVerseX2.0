const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('modal');
const animeTitle = document.getElementById('animeTitle');
const animeDetails = document.getElementById('animeDetails');
const animeTrailer = document.getElementById('animeTrailer');
const modalClose = document.getElementById('modalClose');

searchInput.addEventListener('keyup', async function (e) {
  const query = e.target.value.trim();
  if (query.length < 3) return;
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
  const json = await res.json();
  displayResults(json.data);
});

async function showTopAnime() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=10");
  const json = await res.json();
  displayResults(json.data);
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

function clearSearch() {
  searchInput.value = "";
  resultsDiv.innerHTML = "";
}

function showDetails(anime) {
  animeTitle.textContent = anime.title;
  animeDetails.innerHTML = `<strong>Type:</strong> ${anime.type}<br>
    <strong>Episodes:</strong> ${anime.episodes}<br>
    <strong>Score:</strong> ${anime.score}<br>
    <strong>Status:</strong> ${anime.status}<br>
    <strong>Aired:</strong> ${anime.aired.string || 'N/A'}<br><br>
    ${anime.synopsis || 'No synopsis available.'}`;
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

document.getElementById("topAnime").addEventListener("click", showTopAnime);
document.getElementById("clearResults").addEventListener("click", clearSearch);
modalClose.addEventListener("click", closeModal);
window.onload = showTopAnime;
