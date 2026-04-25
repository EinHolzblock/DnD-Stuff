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
    
    container.innerHTML = data.map(spell => {
        // 1. Safety check for Arrays (Components & Classes)
        // If they don't exist, we use an empty array [] so .join doesn't crash
        const components = spell.components ? spell.components.join(', ') : 'Keine';
        const classes = spell.classes ? spell.classes.join(', ') : 'Keine';

        // 2. Handle the "range/area" key safely
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
    // 1. Grab all current values from your HTML inputs
    const nameQuery = document.getElementById('searchName').value.toLowerCase();
    const levelQuery = document.getElementById('filterLevel').value;
    const classQuery = document.getElementById('filterClass').value;
    const schoolQuery = document.getElementById('filterSchool').value;

    // 2. Run the filter on your master spell list
    const filtered = spells.filter(spell => {
        // Name: Check if search string is inside spell name
        const matchesName = spell.name.toLowerCase().includes(nameQuery);

        // Level: Match exactly (convert to string to be safe)
        const matchesLevel = levelQuery === "" || spell.level.toString() === levelQuery;

        // School: Match exactly
        const matchesSchool = schoolQuery === "" || spell.school === schoolQuery;
        
        // Classes: Since this is an Array ["Magier", "Hexenmeister"], use .includes()
        // We check if the spell's class list includes the one selected in the dropdown
        const matchesClass = classQuery === "" || (spell.classes && spell.classes.includes(classQuery));

        // Only return true if EVERY condition is met
        return matchesName && matchesLevel && matchesSchool && matchesClass;
    });

    // 3. Redraw the cards with the new filtered list
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