let rules = [];

async function loadRules() {
    try {
        const res = await fetch('./data/conditions.json');
        rules = await res.json();
        renderRules(rules);
    } catch (err) {
        console.error("Error loading rules:", err);
    }
}

function renderRules(list) {
    const container = document.getElementById('condition-grid');
    container.innerHTML = '';

    list.forEach(r => {
        const div = document.createElement('div');
        div.className = 'card';
        
        // Color border based on category
        const borderColor = r.category === "Condition" ? "#e74c3c" : "#3498db";
        div.style.borderLeft = `4px solid ${borderColor}`;

        div.innerHTML = `
            <div class="card-header">
                <h3>${r.name} <span style="font-size: 0.8em; color: #888;">(${r.translation})</span></h3>
                <span class="category-tag">${r.category}</span>
            </div>
            <p class="description-text">${r.effect}</p>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    const name = document.getElementById('searchName').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;

    const filtered = rules.filter(r => {
        return (!name || r.name.toLowerCase().includes(name) || r.translation.toLowerCase().includes(name)) &&
               (!category || r.category === category);
    });
    renderRules(filtered);
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', loadRules);
