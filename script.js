let spells = [];
let mySpellbook = JSON.parse(localStorage.getItem('mySpellbook')) || [];

// 1. Load the JSON data
async function loadSpells() {
    try {
        const response = await fetch('./spells.json');
        spells = await response.json();
        renderSpells(spells);
        saveAndRenderSpellbook(); // Load saved sheet
    } catch (error) {
        console.error("Fehler beim Laden der Spells:", error);
    }
}

// 2. Navigation
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

function showPage(pageId) {
    const grimorium = document.getElementById('grimorium-page');
    const header = document.getElementById('main-header');
    const spellsheet = document.getElementById('spellsheet-page');
    
    if (pageId === 'grimorium') {
        grimorium.classList.remove('hidden');
        header.classList.remove('hidden');
        spellsheet.classList.add('hidden');
    } else {
        grimorium.classList.add('hidden');
        header.classList.add('hidden');
        spellsheet.classList.remove('hidden');
        saveAndRenderSpellbook();
    }
    toggleMenu();
}

// 3. Rendering
function renderSpells(data) {
    const container = document.getElementById('spell-list');
    if (!container) return;

    container.innerHTML = data.map(spell => {
        const classes = spell.classes ? spell.classes.join(', ') : 'Keine';
        const range = spell['range/area'] || 'N/A';
        const timeDisplay = spell.ritual ? `${spell.castingTime} (Ritual)` : (spell.castingTime || '1 Aktion');
        
        // --- Inside the renderSpells data.map loop ---

let saveHtml = '';
if (spell.save) {
    let successText = '';
    
    // Check what is written in the JSON for 'onSuccess'
    if (spell.onSuccess === 'half') {
        successText = 'Halber Schaden';
    } else if (!spell.onSuccess) {
        successText = 'Kein Effekt';
    } else {
        // If it's anything else, use the text exactly as typed in JSON
        successText = spell.onSuccess;
    }

    saveHtml = `
        <p class="save-info">
            <strong>RW:</strong> ${spell.save} 
            <br><small>Bei erfolgreichem Wurf: ${successText}</small>
        </p>
    `;
}

        return `
            <div class="spell-card">
                <div class="spell-header">
                    <h3>${spell.name}</h3>
                    <div>
                        <button class="add-btn" onclick="addToSpellbook('${spell.name}')">+</button>
                        <span class="level-badge">Lvl ${spell.level}</span>
                    </div>
                </div>
                <div class="spell-tags">
                    ${spell.ritual ? '<span class="tag ritual">R</span>' : ''}
                    ${spell.concentration ? '<span class="tag concentration">K</span>' : ''}
                </div>
                <p class="meta"><em>${spell.school} • ${range}</em><br>
                <small>⌛ Dauer: ${spell.duration || 'Unmittelbar'}</small></p>
                <div class="spell-stats">
                    ${spell.damage ? `<p><strong>DMG:</strong> ${spell.damage} (${spell.damageType})</p>` : ''}
                    ${spell.effect ? `<p><strong>Effekt:</strong> ${spell.effect}</p>` : ''}
                    ${saveHtml}
                </div>
                <div class="spell-details">
                    <p><strong>Zeit:</strong> ${timeDisplay}</p>
                    <p><strong>Klassen:</strong> ${classes}</p>
                </div>
                ${spell.desc ? `<details class="spell-desc"><summary>Beschreibung</summary><div class="desc-content">${spell.desc}</div></details>` : ''}
            </div>
        `;
    }).join('');
}

// 4. Spellbook & Tooltip Logic
const tooltip = document.getElementById('tooltip');

function showTooltip(e, spellName) {
    const spell = spells.find(s => s.name === spellName);
    if (!spell) return;
    
    // Fixed: range variable wasn't defined here, so we get it from the spell object
    const range = spell['range/area'] || 'N/A';
    
    tooltip.innerHTML = `
        <strong>${spell.name}</strong><br>
        <small>Lvl ${spell.level} ${spell.school}</small><br>
        <small>Duration: ${spell.duration || 'Unmittelbar'}, Range: ${range}</small><br>
        <small>Zeit: ${spell.castingTime || 'N/A'}</small>
        <p style="font-size:0.8rem; margin-top:5px; border-top: 1px solid #444; padding-top: 5px;">
            ${spell.desc ? spell.desc.substring(0, 200) + '...' : 'Keine Beschreibung'}
        </p>`;
    
    tooltip.classList.remove('hidden');
    moveTooltip(e); // Added to ensure it positions immediately
}

function moveTooltip(e) {
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
}

function hideTooltip() { 
    tooltip.classList.add('hidden'); 
}

function addToSpellbook(name) {
    if (!mySpellbook.includes(name)) {
        mySpellbook.push(name);
        saveAndRenderSpellbook();
    }
}

function removeFromSpellbook(name) {
    mySpellbook = mySpellbook.filter(n => n !== name);
    saveAndRenderSpellbook();
}

function saveAndRenderSpellbook() {
    localStorage.setItem('mySpellbook', JSON.stringify(mySpellbook));
    const list = document.getElementById('spellbook-list');
    if (!list) return;

    list.innerHTML = mySpellbook.map(name => {
        const spell = spells.find(s => s.name === name);
        const grade = spell ? (spell.level === 0 ? "T" : spell.level) : "?";
        return `
            <div class="spellbook-item" onmousemove="moveTooltip(event)" onmouseenter="showTooltip(event, '${name}')" onmouseleave="hideTooltip()">
                <span><span class="spell-grade">[Lvl ${grade}]</span> <strong>${name}</strong></span>
                <span onclick="removeFromSpellbook('${name}')" style="color:red; cursor:pointer; font-weight:bold; padding: 0 5px;">×</span>
            </div>
        `;
    }).join('');
}

// 5. Filters
function filterData() {
    const n = document.getElementById('searchName').value.toLowerCase();
    const l = document.getElementById('filterLevel').value;
    const c = document.getElementById('filterClass').value;
    const d = document.getElementById('searchDuration').value.toLowerCase();

    const filtered = spells.filter(s => {
        return s.name.toLowerCase().includes(n) &&
               (l === "" || s.level.toString() === l) &&
               (c === "" || (s.classes && s.classes.includes(c))) &&
               (d === "" || (s.duration && s.duration.toLowerCase().includes(d)));
    });
    renderSpells(filtered);
}

function resetFilters() {
    document.getElementById('searchName').value = "";
    document.getElementById('searchDuration').value = "";
    document.getElementById('filterLevel').value = "";
    document.getElementById('filterClass').value = "";
    renderSpells(spells);
}

// Startup
document.addEventListener('DOMContentLoaded', () => {
    loadSpells();
    
    // Event Listeners for Filters
    const searchName = document.getElementById('searchName');
    const searchDur = document.getElementById('searchDuration');
    const filtLvl = document.getElementById('filterLevel');
    const filtCls = document.getElementById('filterClass');

    if(searchName) searchName.addEventListener('input', filterData);
    if(searchDur) searchDur.addEventListener('input', filterData);
    if(filtLvl) filtLvl.addEventListener('change', filterData);
    if(filtCls) filtCls.addEventListener('change', filterData);
});
