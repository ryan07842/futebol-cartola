const BRASILEIRAO_TEAMS = [
  { id: 1766, name: "atlético-mg" },
  { id: 1777, name: "bahia" },
  { id: 1770, name: "botafogo" },
  { id: 4286, name: "bragantino" },
  { id: 1779, name: "corinthians" },
  { id: 1771, name: "cruzeiro" },
  { id: 1783, name: "flamengo" },
  { id: 1765, name: "fluminense" },
  { id: 3984, name: "fortaleza" },
  { id: 1767, name: "grêmio" },
  { id: 6684, name: "internacional" },
  { id: 4245, name: "juventude" },
  { id: 1769, name: "palmeiras" },
  { id: 1776, name: "são paulo" },
  { id: 1780, name: "vasco da gama" },
  { id: 1782, name: "vitória" },
];

const API_BASE = "https://api.football-data.org/v4/";

document.getElementById("searchTeamForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const teamName = document.getElementById("teamSearch").value.trim().toLowerCase();
  const team = BRASILEIRAO_TEAMS.find(t => t.name === teamName);

  if (team) selectTeam(team);
  else alert("Time não encontrado. Digite exatamente o nome (ex: flamengo).");
});

function selectTeam(team) {
  const pitch = document.getElementById("pitch");
  const bench = document.getElementById("benchList");
  const teamSection = document.getElementById("teamSection");
  document.getElementById("teamName").textContent = "";
  pitch.innerHTML = "";
  bench.innerHTML = "";

  fetch(`${API_BASE}teams/${team.id}`, {
    headers: { "X-Auth-Token": "9fe986d3f3e04c0f82e05d07aad1afd3" },
  })
    .then(r => r.json())
    .then(data => {
      document.getElementById("teamName").textContent = data.name;
      teamSection.classList.remove("hidden");

      const squad = data.squad || [];
      const starters = squad.slice(0, 11);
      const reserves = squad.slice(11);

      renderFormation(starters);
      renderBench(reserves);
    })
    .catch(err => console.error(err));
}

function renderFormation(players) {
  const pitch = document.getElementById("pitch");

  createLine(pitch, "gk", players.slice(0, 1));  // 1 goleiro
  createLine(pitch, "def", players.slice(1, 5)); // 4 zagueiros
  createLine(pitch, "mid", players.slice(5, 8)); // 3 meias
  createLine(pitch, "fwd", players.slice(8, 11)); // 3 atacantes
}

function createLine(pitch, lineClass, players) {
  const line = document.createElement("div");
  line.classList.add("line", lineClass);
  players.forEach(p => {
    const el = document.createElement("div");
    el.classList.add("player");
    el.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="${p.name}">
      <span>${p.name}</span>
    `;
    el.addEventListener("click", () => showPlayerInfo(p));
    line.appendChild(el);
  });
  pitch.appendChild(line);
}

function renderBench(players) {
  const bench = document.getElementById("benchList");
  players.forEach(p => {
    const el = document.createElement("div");
    el.classList.add("player");
    el.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="${p.name}">
      <span>${p.name}</span>
    `;
    el.addEventListener("click", () => showPlayerInfo(p));
    bench.appendChild(el);
  });
}

function showPlayerInfo(player) {
  const modal = document.getElementById("playerModal");
  const details = document.getElementById("playerDetails");

  details.innerHTML = `
    <h3>${player.name}</h3>
    <p><strong>Posição:</strong> ${player.position || "Desconhecida"}</p>
    <p><strong>Nacionalidade:</strong> ${player.nationality || "N/A"}</p>
    <p><strong>Data de nascimento:</strong> ${player.dateOfBirth || "N/A"}</p>
  `;

  modal.classList.remove("hidden");

  document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
  modal.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };
}
