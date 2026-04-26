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
    if (!container) return;

    container.innerHTML = data.map(spell => {
        const classes = spell.classes ? spell.classes.join(', ') : 'Keine';
        const components = spell.components ? spell.components.join(', ') : 'V, S';
        const range = spell['range/area'] || 'N/A';
        
        // Handle Casting Time + Ritual logic
        const timeDisplay = spell.ritual 
            ? `${spell.castingTime || '1 Aktion'} (oder Ritual)` 
            : (spell.castingTime || '1 Aktion');

        // Handle Saving Throw logic
        let saveHtml = '';
        if (spell.save) {
            const successText = spell.onSuccess === 'half' ? 'Halber Schaden' : (spell.onSuccess || 'Kein Effekt');
            saveHtml = `<p class="save-info"><strong>RW:</strong> ${spell.save} <small>(${successText})</small></p>`;
        }

        return `
            <div class="spell-card">
                <div class="spell-header">
                    <h3>${spell.name}</h3>
                    <span class="level-badge">Lvl ${spell.level}</span>
                </div>
                
                <div class="spell-tags">
                    ${spell.ritual ? '<span class="tag ritual">R</span>' : ''}
                    ${spell.concentration ? '<span class="tag concentration">K</span>' : ''}
                </div>

                <p class="meta"><em>${spell.school} • ${range}</em><br>
                <small>⌛ Wirkungsdauer:  ${spell.duration || 'Unmittelbar'}</small>
                </p>
                
                <div class="spell-stats">
                    ${spell.damage ? `<p><strong>Schaden:</strong> ${spell.damage} (${spell.damageType})</p>` : ''}
                    ${spell.effect ? `<p><strong>Effekt:</strong> ${spell.effect}</p>` : ''}
                    ${saveHtml}
                </div>

                <div class="spell-details">
                    <p><strong>Zeit:</strong> ${timeDisplay}</p>
                    <p><strong>Komponenten:</strong> ${components}</p>
                    ${spell.materials ? `<p class="materials"><em>M: ${spell.materials}</em></p>` : ''}
                </div>

                ${spell.desc ? `
                <details class="spell-desc">
                    <summary>Beschreibung anzeigen</summary>
                    <div class="desc-content">${spell.desc}</div>
                </details>
                ` : ''}

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