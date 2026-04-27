let weapons = [];

async function loadWeapons() {
  const res = await fetch('./data/weapons.json');
  weapons = await res.json();
  renderWeapons(weapons);
}

function renderWeapons(list) {
  const container = document.getElementById('weapon-list');
  container.innerHTML = '';

  list.forEach(w => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${w.name}</h3>
      <p>Type: ${w.type}</p>
      <p>Damage: ${w.damage}</p>
      <p>${w.mastery}</p>
    `;
    container.appendChild(div);
  });
}

function applyFilters() {
  const name = document.getElementById('searchName').value.toLowerCase();
  const type = document.getElementById('filterType').value;

  const filtered = weapons.filter(w => {
    return (!name || w.name.toLowerCase().includes(name)) &&
           (!type || w.type === type);
  });

  renderWeapons(filtered);
}

function resetFilters() {
  document.getElementById('searchName').value = '';
  document.getElementById('filterType').value = '';
  renderWeapons(weapons);
}

function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('hidden');
}

document.getElementById('searchName').addEventListener('input', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);

loadWeapons();