let spells = [];
let mySpellbook = JSON.parse(localStorage.getItem('mySpellbook')) || [];

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
                    <div class="header-actions">
                        <button class="add-btn" onclick="addToSpellbook('${spell.name}')">+</button>
                        <span class="level-badge">Lvl ${spell.level}</span>
                    </div>
                </div>
                
                <div class="spell-tags">
                    ${spell.ritual ? '<span class="tag ritual">R</span>' : ''}
                    ${spell.concentration ? '<span class="tag concentration">K</span>' : ''}
                </div>

                <p class="meta"><em>${spell.school} • ${range}</em><br>
                    <small>⌛ Wirkungsdauer: ${spell.duration || 'Unmittelbar'}</small>
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
            </div> `;
    }).join('');
}

// --- SPELLBOOK & TOOLTIP LOGIC ---
const tooltip = document.getElementById('tooltip');

function showTooltip(e, spellName) {
    const spell = spells.find(s => s.name === spellName);
    if (!spell) return;
    tooltip.innerHTML = `
        <div style="border-bottom:1px solid #d4af37; margin-bottom:5px;"><strong>${spell.name}</strong></div>
        <small>${spell.school} • ${spell.level === 0 ? 'Zaubertrick' : 'Lvl ' + spell.level}</small>
        <p style="font-size: 0.8rem; margin-top:5px;">${spell.desc ? spell.desc.substring(0, 150) + '...' : 'Keine Beschreibung'}</p>
    `;
    tooltip.classList.remove('hidden');
    moveTooltip(e);
}

function moveTooltip(e) {
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
}

function hideTooltip() { tooltip.classList.add('hidden'); }

function addToSpellbook(name) {
    if (!mySpellbook.includes(name)) {
        mySpellbook.push(name);
        saveAndRenderSpellbook();
    }
}

function removeFromSpellbook(name) {
    mySpellbook = mySpellbook.filter(s => s !== name);
    saveAndRenderSpellbook();
}

function saveAndRenderSpellbook() {
    localStorage.setItem('mySpellbook', JSON.stringify(mySpellbook));
    const list = document.getElementById('spellbook-list');
    if (!list) return;
    
    if (mySpellbook.length === 0) {
        list.innerHTML = '<p style="color:#666; font-size:0.8rem;">Noch keine Zauber...</p>';
        return;
    }

    list.innerHTML = mySpellbook.map(name => `
        <div class="spellbook-item" 
             onmousemove="moveTooltip(event)" 
             onmouseenter="showTooltip(event, '${name}')" 
             onmouseleave="hideTooltip()">
            <span>${name}</span>
            <span class="remove-btn" onclick="removeFromSpellbook('${name}')">×</span>
        </div>
    `).join('');
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
    saveAndRenderSpellbook();

    // Select all inputs and add listeners automatically
    const searchInput = document.getElementById('searchName');
    const selects = ['filterLevel', 'filterClass', 'filterSchool'];

    if(searchInput) searchInput.addEventListener('input', filterData);
    
    selects.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('change', filterData);
    });
});