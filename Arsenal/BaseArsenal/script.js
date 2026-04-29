/* * Copyright (c) 2026 Tim Reinisch. All Rights Reserved.
 * Unauthorized re-hosting or redistribution is strictly prohibited.
 */
let items = [];

async function loadData() {
    try {
        const response = await fetch('./data/items.json');
        if (!response.ok) throw new Error("items.json nicht gefunden");
        items = await response.json();
        render(items);
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

function render(list) {
    const container = document.getElementById('item-grid');
    container.innerHTML = '';

    list.forEach(i => {
        const div = document.createElement('div');
        div.className = 'card'; 
        
        // 1. Category Specific Logic (Damage, AC, etc.)
        let details = "";
        if (i.category === "Weapon") {
            details = `<p><b>Schaden:</b> ${i.damage || '-'}</p>`;
        } else if (i.category === "Armor") {
            const strReq = i.str ? `<p><b>Stärke:</b> ${i.str}</p>` : '';
            const stealthDis = i.stealth ? `<p><b>Heimlichkeit:</b> Nachteil</p>` : '';
            details = `<p><b>RK (AC):</b> ${i.ac || '-'}</p>${strReq}${stealthDis}`;
        } else {
            details = i.description ? `<p class="description-text">${i.description}</p>` : "";
        }

        // 2. Crafting Time Logic (Shows for any item if key exists)
        const craftingDisplay = i.craftingTime 
            ? `<p class="crafting-text"><b>⏱ Schmiedezeit:</b> ${i.craftingTime}</p>` 
            : '';

        const masteryTag = i.mastery 
            ? `<div class="mastery-tag">✨ Mastery: ${i.mastery}</div>` 
            : '';

        div.innerHTML = `
            <div class="card-content">
                <h3>${i.name}</h3>
                <p><b>Typ:</b> ${i.type || 'Ausrüstung'}</p>
                <p><b>Preis:</b> ${i.cost || '-'} | <b>Gewicht:</b> ${i.weight || '-'}</p>
                ${details}
                ${craftingDisplay}
                <p class="description-text">${i.properties || ''}</p>
            </div>
            ${masteryTag}
            <span class="source-tag">${i.source || 'PHB 2024'}</span>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    // 1. Get values from ALL three inputs
    const nameSearch = document.getElementById('searchName').value.toLowerCase();
    const categoryValue = document.getElementById('filterType').value;
    const subTypeValue = document.getElementById('filterSubType').value;

    const filtered = items.filter(i => {
        // Name Search
        const matchesName = i.name.toLowerCase().includes(nameSearch);
        
        // Category Filter (Weapon, Armor, Gear)
        const matchesCategory = categoryValue === "" || i.category === categoryValue;

        // Sub-Type Filter (Simple Melee, Martial Ranged, etc.)
        // Added (i.type || "") to handle items like 'Streitkolben' that are missing the type key
        const matchesSubType = subTypeValue === "" || (i.type || "") === subTypeValue;

        return matchesName && matchesCategory && matchesSubType;
    });

    render(filtered);
}

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    if (menu) menu.classList.toggle('hidden');
}

// Wire everything up when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // These tell the browser: "When the user interacts with these, run applyFilters"
    document.getElementById('searchName').addEventListener('input', applyFilters);
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterSubType').addEventListener('change', applyFilters);
});
