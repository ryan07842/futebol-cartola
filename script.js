// API SETTINGS - replace API_BASE if your provider uses a different URL structure
// img.alt = player.name;
// img.style.width = '64px'; img.style.height='64px'; img.style.borderRadius='50%';
// const name = document.createElement('div');
// name.style.marginTop='8px'; name.style.fontSize='13px'; name.style.textAlign='center'; name.textContent=player.name;
// el.appendChild(img); el.appendChild(name);
// el.addEventListener('click', ()=> showPlayerInfo(player));
// return el;
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

  const input = document.getElementById("teamSearch");

  const teamName = input.value.trim().toLowerCase();

  const team = BRASILEIRAO_TEAMS.find((t) => t.name === teamName);

  if (team) {
    selectTeam(team);
  } else {
    alert("Time não encontrado. Por favor, digite um nome válido do Brasileirão.");
  }
});

function selectTeam(team) {
  // Clear previous team info
  document.getElementById("teamName").textContent = "";
  document.getElementById("pitch").innerHTML = "";
  document.getElementById("benchList").innerHTML = "";

  // Fetch and display team data
  fetch(`${API_BASE}teams/${team.id}`, {
    headers: {
      "X-Auth-Token": "9fe986d3f3e04c0f82e05d07aad1afd3",
    }, // Replace with your API key
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("teamName").textContent = data.name;

      document.getElementById("teamSection").classList.remove("hidden");

      for(const squadPlayer of data.squad) {
        console.log(squadPlayer.name);

        const playerElement = document.createElement("p");
        playerElement.textContent = `Nome do Jogador: ${squadPlayer.name}`;

        document.getElementById("pitch").appendChild(playerElement);
      }

      // Display players on the pitch
      // const pitch = document.getElementById("pitch");
      // data.squad.forEach((player) => {
      //   const playerEl = createPlayerElement(player);
      //   pitch.appendChild(playerEl);
      // });

      // // Display bench players
      // const benchList = document.getElementById("benchList");
      // data.bench.forEach((player) => {
      //   const playerEl = createPlayerElement(player);
      //   benchList.appendChild(playerEl);
      // });
    })
    .catch((error) => {
      console.error("Error fetching team data:", error);
    });
}

// function showPlayerInfo(player) {
//   playerDetails.innerHTML = "";

//   const wrap = document.createElement("div");
//   wrap.className = "player-info";

//   const img = document.createElement("img");
//   img.src = player.photo || placeholderImage(player.name);

//   const meta = document.createElement("div");
//   meta.className = "player-meta";
//   meta.innerHTML = `<h3>${player.name}</h3>
// <p><strong>Nº</strong>: ${player.number || "-"}<br>
// <strong>Posição</strong>: ${player.position || "-"}<br>
// <strong>Idade</strong>: ${player.age || "-"}<br>
// <strong>Informações</strong>: ${
//     player.info || "Sem informações adicionais"
//   }</p>`;

//   wrap.appendChild(img);
//   wrap.appendChild(meta);

//   playerDetails.appendChild(wrap);
//   playerModal.classList.remove("hidden");
// }

// closeModalBtn.addEventListener("click", () =>
//   playerModal.classList.add("hidden")
// );

// playerModal.addEventListener("click", (e) => {
//   if (e.target === playerModal) playerModal.classList.add("hidden");
// });

// function placeholderImage(name) {
//   // simple avatar generator using initials (data URL) - small and offline
//   const initials = name
//     .split(" ")
//     .map((s) => s[0]?.toUpperCase())
//     .slice(0, 2)
//     .join("");

//   const canvas = document.createElement("canvas");
//   canvas.width = 200;
//   canvas.height = 200;

//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = "#ddd";
//   ctx.fillRect(0, 0, 200, 200);
//   ctx.fillStyle = "#444";
//   ctx.font = "90px sans-serif";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText(initials, 100, 105);

//   return canvas.toDataURL();
// }

// // ---- Mock data helpers (keeps UI functional even if API is unavailable) ----
// function mockStarters() {
//   // create 11 mock players
//   const posOrder = [
//     "GK",
//     "LB",
//     "CB",
//     "CB",
//     "RB",
//     "CM",
//     "CM",
//     "CM",
//     "LW",
//     "ST",
//     "RW",
//   ];

//   return posOrder.map((pos, i) => ({
//     name: `Jogador ${i + 1}`,
//     number: `${i + 1}`,
//     position: pos,
//     photo: null,
//     age: 24 + (i % 6),
//     info: `Mock: Jogador que atua como ${pos}`,
//   }));
// }

// function mockBench() {
//   return Array.from({ length: 7 }).map((_, i) => ({
//     name: `Reserva ${i + 1}`,
//     number: 20 + i,
//     position: "Substituto",
//     photo: null,
//     age: 22 + i,
//     info: "Jogador reserva",
//   }));
// }

// function mockSquad(teamName) {
//   return { starters: mockStarters(), bench: mockBench(), team: teamName };
// }

// // Optional: if user presses Enter on input and there's exactly one match, select it
// searchInput.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") {
//     const matches = filterTeams(searchInput.value);
//     if (matches.length === 1) selectTeam(matches[0]);
//   }
// });

// // Initial accessibility: hide suggestions when clicking outside
// document.addEventListener("click", (e) => {
//   if (!e.target.closest(".search-area")) suggestions.classList.add("hidden");
// });


