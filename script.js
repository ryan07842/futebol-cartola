const API_BASE = "https://api.football-data.org/v4/";
const API_KEY = "9fe986d3f3e04c0f82e05d07aad1afd3";

// Carregar times
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

// Ao selecionar time
document.getElementById("teamSelect").addEventListener("change", (e) => {
  const selected = e.target.options[e.target.selectedIndex];
  if (selected.value && selected.dataset.id) {
    selectTeam({ id: selected.dataset.id, name: selected.textContent });
  }
});

function selectTeam(team) {
  const teamSection = document.getElementById("teamSection");
  const pitch = document.getElementById("pitch");
  const bench = document.getElementById("benchList");
  const teamInfo = document.getElementById("teamInfo");
  const teamLogo = document.getElementById("teamLogo");
  const competitions = document.getElementById("competitionsList");

  pitch.innerHTML = "";
  bench.innerHTML = "";
  teamInfo.innerHTML = "";
  teamLogo.innerHTML = "";
  competitions.innerHTML = "";
  teamSection.classList.add("hidden");

  fetch(`${API_BASE}teams/${team.id}`, {
    headers: { "X-Auth-Token": API_KEY },
  })
    .then(r => r.json())
    .then(data => {
      teamSection.classList.remove("hidden");
      document.getElementById("teamName").textContent = data.name;
      teamLogo.innerHTML = data.crest ? `<img src="${data.crest}" alt="Escudo">` : "";

      // Info do time
      const teamData = `
        <p><strong>Fundado:</strong> ${data.founded || "Desconhecido"}</p>
        <p><strong>Estádio:</strong> ${data.venue || "Não informado"}</p>
        <p><strong>País:</strong> ${data.area?.name || "Desconhecido"}</p>
        <p><strong>Site:</strong> ${
          data.website ? `<a href="${data.website}" target="_blank">${data.website}</a>` : "N/D"
        }</p>
      `;

      // Técnico
      let coachHTML = "";
      if (data.coach) {
        coachHTML = `
          <div class="coach-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" alt="Coach">
            <p><strong>${data.coach.name}</strong></p>
            <p>${data.coach.nationality || ""}</p>
          </div>
        `;
      }

      teamInfo.innerHTML = `<h3>Informações</h3>${teamData}${coachHTML}`;

      // Competições
      if (data.runningCompetitions?.length) {
        data.runningCompetitions.forEach(c => {
          const li = document.createElement("li");
          li.textContent = c.name;
          competitions.appendChild(li);
        });
      } else {
        competitions.innerHTML = "<li>Sem competições ativas.</li>";
      }

      // Jogadores
      const squad = data.squad || [];
      const goalkeepers = squad.filter(p => p.position === "Goalkeeper");
      const defence = squad.filter(p => p.position === "Defence");
      const midfield = squad.filter(p => p.position === "Midfield");
      const offence = squad.filter(p => p.position === "Offence");

      const benchPlayers = renderFormation(goalkeepers, defence, midfield, offence);
      renderBench(benchPlayers);
    })
    .catch(err => console.error(err));
}

// Ícones diferentes por posição
function getPlayerImage(position) {
  switch (position) {
    case "Goalkeeper": return "https://static.vecteezy.com/ti/vetor-gratis/p1/3773404-futebol-luvas-com-bola-gratis-vetor.jpg";
    case "Defence": return "https://static.vecteezy.com/ti/vetor-gratis/p1/27382508-medieval-heraldico-casaco-do-bracos-desenho-animado-plano-ilustracao-defesa-e-protecao-velho-armas-e-armaduras-do-cavaleiro-e-guerreiro-cinzento-guarda-escudo-e-cruzado-espada-vetor.jpg";
    case "Midfield": return "https://images.vexels.com/media/users/3/140310/isolated/preview/e26362612f9316ef32b49451475d8f07-passe-de-jogador-de-futebol.png";
    case "Offence": return "https://images.vexels.com/media/users/3/234542/isolated/preview/52602949bf63a8b7c396157d55bc5d97-rede-de-gol-de-futebol.png";
    default: return "https://cdn-icons-png.flaticon.com/512/3176/3176266.png";
  }
}

// Renderização da formação
function renderFormation(goalkeepers, defence, midfield, offence) {
  const pitch = document.getElementById("pitch");
  const gk = goalkeepers.slice(0, 1);
  const def = defence.slice(0, 4);
  const mid = midfield.slice(0, 3);
  const off = offence.slice(0, 3);

  createLine(pitch, gk, 50, 90);
  createLine(pitch, def, 50, 70);
  createLine(pitch, mid, 50, 50);
  createLine(pitch, off, 50, 30);

  return [...goalkeepers.slice(1), ...defence.slice(4), ...midfield.slice(3), ...offence.slice(3)];
}

// Cria linhas
function createLine(pitch, players, centerY, yPos) {
  const spacing = 100 / (players.length + 1);
  players.forEach((p, i) => {
    const x = spacing * (i + 1);
    const div = document.createElement("div");
    div.classList.add("player");
    div.style.left = `${x}%`;
    div.style.top = `${yPos}%`;

    const img = getPlayerImage(p.position);
    div.innerHTML = `<img src="${img}" alt=""><span>${p.name}</span>`;
    div.addEventListener("click", () => showPlayerInfo(p));
    pitch.appendChild(div);
  });
}

// Banco
function renderBench(players) {
  const bench = document.getElementById("benchList");
  players.forEach(p => {
    const img = getPlayerImage(p.position);
    const el = document.createElement("div");
    el.classList.add("player");
    el.innerHTML = `<img src="${img}" alt=""><span>${p.name}</span>`;
    el.addEventListener("click", () => showPlayerInfo(p));
    bench.appendChild(el);
  });
}

// Modal jogador
function showPlayerInfo(player) {
  const modal = document.getElementById("playerModal");
  const details = document.getElementById("playerDetails");
  details.innerHTML = `
    <h3>${player.name}</h3>
    <p><strong>Posição:</strong> ${player.position || "Desconhecida"}</p>
    <p><strong>Nacionalidade:</strong> ${player.nationality || "N/A"}</p>
    <p><strong>Data de nascimento:</strong> ${player.dateOfBirth || "N/A"}</p>
  `;
  modal.style.display = "flex";
  document.getElementById("closeModal").onclick = () => modal.style.display = "none";
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}
