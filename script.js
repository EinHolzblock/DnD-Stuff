let spells = [];

// 1. Load the JSON data
async function loadSpells() {
    try {
        const response = await fetch('spells.json');
        spells = await response.json();
        renderSpells(spells);
    } catch (error) {
        console.error("Fehler beim Laden der Spells:", error);
    }
}

// 2. Display the spells
function renderSpells(data) {
    const container = document.getElementById('spell-list');
    container.innerHTML = data.map(spell => `
        <div class="spell-card">
            <div class="spell-header">
                <h3>${spell.name}</h3>
                <span class="level-badge">Lvl ${spell.level}</span>
            </div>
            <p class="meta"><em>${spell.school} • ${spell['range/area']}</em></p>
            <p class="classes"><strong>Klassen:</strong> ${spell.classes.join(', ')}</p>
            <p class="source">${spell.source}</p>
        </div>
    `).join('');
}

// 3. Search and Filter Logic
function filterData() {
    const nameQuery = document.getElementById('searchName').value.toLowerCase();
    const levelQuery = document.getElementById('filterLevel').value;

    const filtered = spells.filter(spell => {
        const matchesName = spell.name.toLowerCase().includes(nameQuery);
        const matchesLevel = levelQuery === "" || spell.level.toString() === levelQuery;
        return matchesName && matchesLevel;
    });

    renderSpells(filtered);
}

// Event Listeners
document.getElementById('searchName').addEventListener('input', filterData);
document.getElementById('filterLevel').addEventListener('change', filterData);

// Initial Load
loadSpells();