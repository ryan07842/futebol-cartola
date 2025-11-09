const API_BASE = "https://api.football-data.org/v4/";
const API_KEY = "9fe986d3f3e04c0f82e05d07aad1afd3";

// Carrega os times
document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE}competitions/2013/teams`, {
    headers: { "X-Auth-Token": API_KEY },
  })
    .then(res => res.json())
    .then(data => populateTeams(data.teams || []))
    .catch(err => console.error("Erro ao carregar times:", err));
});

function populateTeams(teams) {
  const select = document.getElementById("teamSelect");
  select.innerHTML = `<option value="">Selecione um time</option>`;
  teams.forEach(team => {
    const option = document.createElement("option");
    option.value = team.name.toLowerCase();
    option.textContent = team.name;
    option.dataset.id = team.id;
    select.appendChild(option);
  });
}

document.getElementById("teamSelect").addEventListener("change", (e) => {
  const selected = e.target.options[e.target.selectedIndex];
  if (selected.value && selected.dataset.id) {
    selectTeam({ id: selected.dataset.id, name: selected.textContent });
  }
});

function selectTeam(team) {
  const pitch = document.getElementById("pitch");
  const bench = document.getElementById("benchList");
  const teamSection = document.getElementById("teamSection");
  const teamInfo = document.getElementById("teamInfo");

  document.getElementById("teamName").textContent = "";
  pitch.innerHTML = "";
  bench.innerHTML = "";
  teamInfo.innerHTML = "";
  teamInfo.classList.add("hidden");

  fetch(`${API_BASE}teams/${team.id}`, {
    headers: { "X-Auth-Token": API_KEY },
  })
    .then(r => r.json())
    .then(data => {
      document.getElementById("teamName").textContent = data.name;
      teamSection.classList.remove("hidden");

      // 🧾 Exibir informações gerais do time
      const teamData = `
        <p><strong>Nome completo:</strong> ${data.name}</p>
        <p><strong>Fundado em:</strong> ${data.founded || "Desconhecido"}</p>
        <p><strong>Estádio:</strong> ${data.venue || "Não informado"}</p>
        <p><strong>País:</strong> ${data.area?.name || "Desconhecido"}</p>
        <p><strong>Site oficial:</strong> 
          ${data.website ? `<a href="${data.website}" target="_blank">${data.website}</a>` : "Não disponível"}
        </p>
      `;

      // 👔 Coach (técnico)
      let coachHTML = "";
      if (data.coach) {
        coachHTML = `
          <div class="coach-card">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Coach">
            <div>
              <p><strong>Técnico:</strong> ${data.coach.name}</p>
              <p><strong>Nacionalidade:</strong> ${data.coach.nationality || "N/A"}</p>
              <p><strong>Data de nascimento:</strong> ${data.coach.dateOfBirth || "N/A"}</p>
            </div>
          </div>
        `;
      }

      teamInfo.innerHTML = teamData + coachHTML;
      teamInfo.classList.remove("hidden");

      // ⚽ Montar elenco
      const squad = data.squad || [];
      const goalkeepers = squad.filter(p => p.position === "Goalkeeper");
      const defence = squad.filter(p => p.position === "Defence");
      const midfield = squad.filter(p =>
        ["Midfield", "Central Midfield", "Attacking Midfield", "Defensive Midfield"].includes(p.position)
      );
      const offence = squad.filter(p =>
        ["Offence", "Forward", "Left Winger", "Right Winger", "Centre-Forward"].includes(p.position)
      );

      const benchPlayers = renderFormation(goalkeepers, defence, midfield, offence);
      renderBench(benchPlayers);
    })
    .catch(err => console.error(err));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderFormation(goalkeepers, defence, midfield, offence) {
  const pitch = document.getElementById("pitch");
  shuffleArray(goalkeepers);
  shuffleArray(defence);
  shuffleArray(midfield);
  shuffleArray(offence);

  const gk = goalkeepers.slice(0, 1);
  const def = defence.slice(0, 4);
  const mid = midfield.slice(0, 3);
  const off = offence.slice(0, 3);
  const reserves = goalkeepers.slice(1)
    .concat(defence.slice(4))
    .concat(midfield.slice(3))
    .concat(offence.slice(3));

  createLine(pitch, "gk", gk);
  createLine(pitch, "def", def);
  createLine(pitch, "mid", mid);
  createLine(pitch, "fwd", off);
  return reserves;
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
