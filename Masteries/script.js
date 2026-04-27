let weapons = [];
let myArsenal = JSON.parse(localStorage.getItem('myArsenal')) || [];

// 1. Daten laden
async function loadWeapons() {
    try {
        const response = await fetch('./weapons.json');
        weapons = await response.json();
        renderWeapons(weapons);
        saveAndRenderArsenal(); 
    } catch (error) {
        console.error("Fehler beim Laden der Waffen:", error);
    }
}

// 2. Navigation
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

function showPage(pageId) {
    const listPage = document.getElementById('grimorium-page'); // Bleibt bei deinem ID-Namen
    const header = document.getElementById('main-header');
    const arsenalPage = document.getElementById('spellsheet-page'); 
    
    if (pageId === 'list') {
        listPage.classList.remove('hidden');
        header.classList.remove('hidden');
        arsenalPage.classList.add('hidden');
    } else {
        listPage.classList.add('hidden');
        header.classList.add('hidden');
        arsenalPage.classList.remove('hidden');
        saveAndRenderArsenal();
    }
    toggleMenu();
}

// 3. Rendering der Waffenkarten
function renderWeapons(data) {
    const container = document.getElementById('spell-list'); // Container-ID aus deinem HTML
    if (!container) return;

    container.innerHTML = data.map(weapon => {
        const props = weapon.properties ? weapon.properties.join(', ') : 'Keine';
        
        let saveHtml = '';
        if (weapon.save) {
            saveHtml = `
                <p class="save-info">
                    <strong>RW:</strong> ${weapon.save} 
                    <br><small>Bei Erfolg: ${weapon.onSuccess || 'Kein Effekt'}</small>
                </p>
            `;
        }

        return `
            <div class="spell-card">
                <div class="spell-header">
                    <h3>${weapon.name}</h3>
                    <div>
                        <button class="add-btn" onclick="addToArsenal('${weapon.name}')">+</button>
                        <span class="level-badge">${weapon.mastery}</span>
                    </div>
                </div>
                <div class="spell-tags">
                    <span class="tag ritual">${weapon.damageType}</span>
                </div>
                <p class="meta"><em>Eigenschaften: ${props}</em></p>
                <div class="spell-stats">
                    <p><strong>Schaden:</strong> ${weapon.damage} (${weapon.damageType})</p>
                    <p><strong>Meister-Effekt:</strong> ${weapon.masteryEffect}</p>
                    ${saveHtml}
                </div>
                ${weapon.desc ? `<details class="spell-desc"><summary>Details</summary><div class="desc-content">${weapon.desc}</div></details>` : ''}
            </div>
        `;
    }).join('');
}

// 4. Arsenal (Dein "Spellbook") & Tooltip
const tooltip = document.getElementById('tooltip');

function showTooltip(e, weaponName) {
    const w = weapons.find(item => item.name === weaponName);
    if (!w) return;
    
    tooltip.innerHTML = `
        <strong>${w.name}</strong><br>
        <small>Meisterschaft: ${w.mastery}</small><br>
        <small>Schaden: ${w.damage}</small>
        <p style="font-size:0.8rem; margin-top:5px; border-top: 1px solid #444; padding-top: 5px;">
            ${w.masteryEffect}
        </p>`;
    
    tooltip.classList.remove('hidden');
    moveTooltip(e);
}

function moveTooltip(e) {
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
}

function hideTooltip() { tooltip.classList.add('hidden'); }

function addToArsenal(name) {
    if (!myArsenal.includes(name)) {
        myArsenal.push(name);
        saveAndRenderArsenal();
    }
}

function removeFromArsenal(name) {
    myArsenal = myArsenal.filter(n => n !== name);
    saveAndRenderArsenal();
}

function saveAndRenderArsenal() {
    localStorage.setItem('myArsenal', JSON.stringify(myArsenal));
    const list = document.getElementById('spellbook-list');
    if (!list) return;

    list.innerHTML = myArsenal.map(name => {
        const w = weapons.find(item => item.name === name);
        const masteryTag = w ? w.mastery : "?";
        return `
            <div class="spellbook-item" onmousemove="moveTooltip(event)" onmouseenter="showTooltip(event, '${name}')" onmouseleave="hideTooltip()">
                <span><span class="spell-grade">[${masteryTag}]</span> <strong>${name}</strong></span>
                <span onclick="removeFromArsenal('${name}')" style="color:red; cursor:pointer; font-weight:bold; padding: 0 5px;">×</span>
            </div>
        `;
    }).join('');
}

// 5. Filter
function filterData() {
    const n = document.getElementById('searchName').value.toLowerCase();
    const m = document.getElementById('filterMastery').value.toLowerCase();

    const filtered = weapons.filter(w => {
        return w.name.toLowerCase().includes(n) &&
               (m === "" || w.mastery.toLowerCase() === m);
    });
    renderWeapons(filtered);
}

// Startup
document.addEventListener('DOMContentLoaded', () => {
    loadWeapons();
    
    const searchName = document.getElementById('searchName');
    const filtMast = document.getElementById('filterMastery');

    if(searchName) searchName.addEventListener('input', filterData);
    if(filtMast) filtMast.addEventListener('change', filterData);
});
