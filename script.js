const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

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
    <div class="anime-box">
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
      <h3>${anime.title}</h3>
      <div class="info"> Rating ${anime.score || 'N/A'} | ${anime.type} | ${anime.episodes || '?'} ep</div>
      <div class="synopsis">${anime.synopsis || 'No synopsis available.'}</div>
    </div>
  `).join('');
}

function clearSearch() {
  searchInput.value = "";
  resultsDiv.innerHTML = "";
}

document.getElementById("topAnime").addEventListener("click", showTopAnime);
document.getElementById("clearResults").addEventListener("click", clearSearch);
window.onload = showTopAnime;
