let spells = [];

// 1. Load the JSON data
async function loadSpells() {
    try {
        const response = await fetch('./spells.json');
        spells = await response.json();
        renderSpells(spells);
    } catch (error) {
        console.error("Fehler beim Laden der Spells:", error);
    }
}

// 2. Display the spells (Use your existing renderSpells code here)
function renderSpells(data) {
    const container = document.getElementById('spell-list');
    if (!container) return; // Safety check

    container.innerHTML = data.map(spell => {
        const components = spell.components ? spell.components.join(', ') : 'Keine';
        const classes = spell.classes ? spell.classes.join(', ') : 'Keine';
        const range = spell['range/area'] || 'N/A';

        return `
            <div class="spell-card">
                <div class="spell-header">
                    <h3>${spell.name}</h3>
                    <span class="level-badge">Lvl ${spell.level}</span>
                </div>
                <p class="meta"><em>${spell.school} • ${range}</em></p>
                <div class="spell-details">
                    <p><strong>Zeit:</strong> ${spell.castingTime || 'Unbekannt'}</p>
                    <p><strong>Komponenten:</strong> ${components}</p>
                    ${spell.materials ? `<p class="materials"><em>M: ${spell.materials}</em></p>` : ''}
                </div>
                <p class="classes"><strong>Klassen:</strong> ${classes}</p>
                <p class="source">${spell.source || ''}</p>
            </div>
        `;
    }).join('');
}

// 3. Search and Filter Logic
function filterData() {
    const nameQuery = document.getElementById('searchName').value.toLowerCase();
    const levelQuery = document.getElementById('filterLevel').value;
    const classQuery = document.getElementById('filterClass').value;
    const schoolQuery = document.getElementById('filterSchool').value;

    const filtered = spells.filter(spell => {
        const matchesName = spell.name.toLowerCase().includes(nameQuery);
        const matchesLevel = levelQuery === "" || spell.level.toString() === levelQuery;
        const matchesSchool = schoolQuery === "" || spell.school === schoolQuery;
        const matchesClass = classQuery === "" || (spell.classes && spell.classes.includes(classQuery));

        return matchesName && matchesLevel && matchesSchool && matchesClass;
    });

    renderSpells(filtered);
}

// 4. Reset Filters
function resetFilters() {
    document.getElementById('searchName').value = "";
    document.getElementById('filterLevel').value = "";
    document.getElementById('filterClass').value = "";
    document.getElementById('filterSchool').value = "";
    renderSpells(spells);
}

// 5. ATTACH LISTENERS ONLY WHEN DOM IS READY
document.addEventListener('DOMContentLoaded', () => {
    loadSpells();

    // Select all inputs and add listeners automatically
    const searchInput = document.getElementById('searchName');
    const selects = ['filterLevel', 'filterClass', 'filterSchool'];

    if(searchInput) searchInput.addEventListener('input', filterData);
    
    selects.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('change', filterData);
    });
});