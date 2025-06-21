const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('modal');
const animeTitle = document.getElementById('animeTitle');
const animeDetails = document.getElementById('animeDetails');
const animeTrailer = document.getElementById('animeTrailer');
const modalClose = document.getElementById('modalClose');

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
      <div class="info">Rating: ⭐ ${anime.score || 'N/A'}</div>
      <div class="synopsis">${anime.synopsis || 'No synopsis available.'}</div>
    </div>
  `).join('');
}

function showDetails(anime) {
  animeTitle.textContent = anime.title;
  animeDetails.innerHTML = `
    <p><strong>Type:</strong> ${anime.type}</p>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p><strong>Episodes:</strong> ${anime.episodes}</p>
    <p><strong>Rating:</strong> ${anime.score || 'N/A'}</p>
    <p><strong>Aired:</strong> ${anime.aired?.string || 'N/A'}</p>
    <p><strong>Synopsis:</strong> ${anime.synopsis || 'No synopsis available.'}</p>
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

function clearSearch() {
  searchInput.value = "";
  resultsDiv.innerHTML = "";
}

function closeModal() {
  modal.style.display = "none";
  animeTrailer.src = "";
}

document.getElementById("topAnime").addEventListener("click", showTopAnime);
document.getElementById("clearResults").addEventListener("click", clearSearch);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

window.onload = showTopAnime;
