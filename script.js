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
            
            <div class="spell-details">
                <p><strong>Zeit:</strong> ${spell.castingTime}</p>
                <p><strong>Komponenten:</strong> ${spell.components.join(', ')}</p>
                ${spell.materials ? `<p class="materials"><em>M: ${spell.materials}</em></p>` : ''}
            </div>

            <p class="classes"><strong>Klassen:</strong> ${spell.classes.join(', ')}</p>
            <p class="source">${spell.source}</p>
        </div>
    `).join('');
}

// 3. Search and Filter Logic
function filterData() {
    const nameQuery = document.getElementById('searchName').ariaValueMax.toLowerCase();
    const levelQuery = document.getElementById('filterLevel').value;
    const classQuery = document.getElementById('filterClass').value;
    const schoolQuery = document.getElementById('filterSchool').value;

    const filtered = spells.filter(spell => {
        const matchesName = spell.name.toLowerCase().includes(nameQuery);
        const matchesLevel = levelQuery === "" || spell.level.toString() === levelQuery;
        const matchesSchool = schoolQuery === "" || spell.school === schoolQuery;

        //Logic for Array (Classes)
        const matchesClass = classQuery === "" || spell.classes.includes(classQuery);

        return matchesName && matchesLevel && matchesSchool && matchesClass;
    })
    renderSpells(filtered);
}

//Reset Filters
function resetFilters() {
    document.getElementById('searchName').value = "";
    document.getElementById('filterLevel').value = "";
    document.getElementById('filterClass').value = "";
    document.getElementById('filterSchool').value = "";
    renderSpells(spells); // Show everything again
}

// Event Listeners
document.getElementById('searchName').addEventListener('input', filterData);
document.getElementById('filterLevel').addEventListener('change', filterData);
document.getElementById('filterClass').addEventListener('change', filterData);
document.getElementById('filterSchool').addEventListener('change', filterData);

// Initial Load
loadSpells();