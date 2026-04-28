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
        div.className = 'card'; // This is the most important class!
        
        let details = "";
        if (i.category === "Weapon") {
            details = `<p><b>Schaden:</b> ${i.damage || '-'}</p>`;
        } else if (i.category === "Armor") {
            details = `<p><b>RK (AC):</b> ${i.ac || '-'}</p>`;
        } else {
            details = i.description ? `<p class="description-text">${i.description}</p>` : "";
        }

        const masteryTag = i.mastery 
            ? `<div class="mastery-tag">✨ Mastery: ${i.mastery}</div>` 
            : '';

        div.innerHTML = `
            <div class="card-content">
                <h3>${i.name}</h3>
                <p><b>Typ:</b> ${i.type}</p>
                <p><b>Preis:</b> ${i.cost || '-'} | <b>Gewicht:</b> ${i.weight || '-'}</p>
                ${details}
                <p class="description-text">${i.properties || ''}</p>
            </div>
            ${masteryTag}
            <span class="source-tag">${i.source || 'PHB 2024'}</span>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    const nameSearch = document.getElementById('searchName').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;

    const filtered = items.filter(i => {
        const matchesName = i.name.toLowerCase().includes(nameSearch);
        const matchesType = typeFilter === "" || i.category === typeFilter;
        return matchesName && matchesType;
    });
    render(filtered);
}

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', loadData);
