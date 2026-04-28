/* * Copyright (c) 2026 Tim Reinisch. All Rights Reserved.
 * Unauthorized re-hosting or redistribution is strictly prohibited.
 */
let rules = [];

async function loadRules() {
    try {
        const res = await fetch('./data/conditions.json');
        rules = await res.json();
        renderRules(rules);
    } catch (err) {
        console.error("Fehler beim Laden:", err);
    }
}

function renderRules(list) {
    const container = document.getElementById('condition-grid');
    container.innerHTML = '';

    list.forEach(r => {
        const div = document.createElement('div');
        div.className = 'card';
        
        // Dynamic colors based on Category
        const borderColor = r.category === "Condition" ? "#e74c3c" : "#3498db";
        div.style.borderLeft = `4px solid ${borderColor}`;

        div.innerHTML = `
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="margin: 0;">${r.name}</h3>
                    <small style="color: #888;">${r.translation}</small>
                </div>
                <span class="category-tag" style="background: ${borderColor}44; color: ${borderColor}; border: 1px solid ${borderColor};">
                    ${r.category}
                </span>
            </div>
            <p class="description-text" style="margin-top: 15px;">${r.effect}</p>
            <div style="margin-top: auto; padding-top: 10px; text-align: right;">
                <span style="font-size: 0.75em; color: #555; font-style: italic;">Quelle: ${r.source || 'Unbekannt'}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    const name = document.getElementById('searchName').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;

    const filtered = rules.filter(r => {
        const matchesName = !name || 
            r.name.toLowerCase().includes(name) || 
            r.translation.toLowerCase().includes(name);
        const matchesCategory = !category || r.category === category;
        
        return matchesName && matchesCategory;
    });
    renderRules(filtered);
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', loadRules);
