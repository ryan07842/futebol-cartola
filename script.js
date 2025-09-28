// API SETTINGS - replace API_BASE if your provider uses a different URL structure
// img.alt = player.name;
// img.style.width = '64px'; img.style.height='64px'; img.style.borderRadius='50%';
// const name = document.createElement('div');
// name.style.marginTop='8px'; name.style.fontSize='13px'; name.style.textAlign='center'; name.textContent=player.name;
// el.appendChild(img); el.appendChild(name);
// el.addEventListener('click', ()=> showPlayerInfo(player));
// return el;
const BRASILEIRAO_TEAMS = [
  { id: 1, name: 'Atlético-MG' },
  { id: 2, name: 'Atlético-GO' },
  { id: 3, name: 'Athletico-PR' },
  { id: 4, name: 'Bahia' },
  { id: 5, name: 'Botafogo' },
  { id: 6, name: 'Bragantino' },
  { id: 7, name: 'Corinthians' },
  { id: 8, name: 'Criciúma' },
  { id: 9, name: 'Cruzeiro' },
  { id: 10, name: 'Cuiabá' },
  { id: 11, name: 'Flamengo' },
  { id: 12, name: 'Fluminense' },
  { id: 13, name: 'Fortaleza' },
  { id: 14, name: 'Grêmio' },
  { id: 15, name: 'Internacional' },
  { id: 16, name: 'Juventude' },
  { id: 17, name: 'Palmeiras' },
  { id: 18, name: 'São Paulo' },
  { id: 19, name: 'Vasco da Gama' },
  { id: 20, name: 'Vitória' }
];


function showPlayerInfo(player){
playerDetails.innerHTML = '';
const wrap = document.createElement('div');
wrap.className = 'player-info';
const img = document.createElement('img');
img.src = player.photo || placeholderImage(player.name);
const meta = document.createElement('div');
meta.className = 'player-meta';
meta.innerHTML = `<h3>${player.name}</h3>
<p><strong>Nº</strong>: ${player.number || '-'}<br>
<strong>Posição</strong>: ${player.position || '-'}<br>
<strong>Idade</strong>: ${player.age || '-'}<br>
<strong>Informações</strong>: ${player.info || 'Sem informações adicionais'}</p>`;
wrap.appendChild(img); wrap.appendChild(meta);
playerDetails.appendChild(wrap);
playerModal.classList.remove('hidden');
}
closeModalBtn.addEventListener('click', ()=> playerModal.classList.add('hidden'));
playerModal.addEventListener('click', (e)=> { if(e.target === playerModal) playerModal.classList.add('hidden'); });


function placeholderImage(name){
// simple avatar generator using initials (data URL) - small and offline
const initials = name.split(' ').map(s=>s[0]?.toUpperCase()).slice(0,2).join('');
const canvas = document.createElement('canvas'); canvas.width=200; canvas.height=200;
const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ddd'; ctx.fillRect(0,0,200,200);
ctx.fillStyle = '#444'; ctx.font='90px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(initials,100,105);
return canvas.toDataURL();
}


// ---- Mock data helpers (keeps UI functional even if API is unavailable) ----
function mockStarters(){
// create 11 mock players
const posOrder = ['GK','LB','CB','CB','RB','CM','CM','CM','LW','ST','RW'];
return posOrder.map((pos,i)=>({
name: `Jogador ${i+1}`,
number: `${(i+1)}`,
position: pos,
photo: null,
age: 24 + (i%6),
info: `Mock: Jogador que atua como ${pos}`
}));
}
function mockBench(){
return Array.from({length:7}).map((_,i)=>({name:`Reserva ${i+1}`, number: 20+i, position:'Substituto', photo:null, age:22+i, info:'Jogador reserva'}));
}
function mockSquad(teamName){
return { starters: mockStarters(), bench: mockBench(), team: teamName };
}


// Optional: if user presses Enter on input and there's exactly one match, select it
searchInput.addEventListener('keydown', (e)=>{
if(e.key === 'Enter'){
const matches = filterTeams(searchInput.value);
if(matches.length === 1) selectTeam(matches[0]);
}
});


// Initial accessibility: hide suggestions when clicking outside
document.addEventListener('click', (e)=>{ if(!e.target.closest('.search-area')) suggestions.classList.add('hidden'); });