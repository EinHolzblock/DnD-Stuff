/* * Copyright (c) 2026 Tim Reinisch. All Rights Reserved.
 * Unauthorized re-hosting or redistribution is strictly prohibited.
 */
let items = [];
async function loadItems() {
    const res = await fetch('./data/items.json');
    items = await res.json();
    render(items);
}

function render(list) {
    const container = document.getElementById('item-grid');
    container.innerHTML = '';
    list.forEach(i => {
        const div = document.createElement('div');
        div.className = 'card';
        // Color border by rarity
        const colors = { "Common": "#888", "Uncommon": "#1eff00", "Rare": "#0070dd", "Very Rare": "#a335ee", "Legendary": "#ff8000" };
        div.style.borderLeft = `4px solid ${colors[i.rarity] || '#555'}`;

        div.innerHTML = `
            <div class="card-header">
                <h3>${i.name}</h3>
                <span class="category-tag">${i.rarity}</span>
            </div>
            <p><b>Typ:</b> ${i.type}</p>
            <p><b>Attunement:</b> ${i.attunement ? 'Ja' : 'Nein'}</p>
            <p class="description-text">${i.effect}</p>
            <span class="source-tag">${i.source}</span>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    const name = document.getElementById('searchName').value.toLowerCase();
    const rarity = document.getElementById('filterRarity').value;
    const filtered = items.filter(i => 
        (!name || i.name.toLowerCase().includes(name)) &&
        (!rarity || i.rarity === rarity)
    );
    render(filtered);
}

function toggleMenu() { document.getElementById('nav-menu').classList.toggle('hidden'); }
document.addEventListener('DOMContentLoaded', loadItems);
