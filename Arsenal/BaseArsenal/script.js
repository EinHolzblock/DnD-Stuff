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
        div.innerHTML = `
            <h3>${i.name}</h3>
            <p><b>Typ:</b> ${i.type}</p>
            <p><b>Gewicht:</b> ${i.weight || '-'}</p>
            <p><b>Preis:</b> ${i.cost || '-'}</p>
            <p class="description-text">${i.properties || ''}</p>
            <span class="source-tag">${i.source}</span>
        `;
        container.appendChild(div);
    });
}

function applyFilters() {
    const name = document.getElementById('searchName').value.toLowerCase();
    const type = document.getElementById('filterType').value;
    const filtered = items.filter(i => 
        (!name || i.name.toLowerCase().includes(name)) &&
        (!type || i.type === type)
    );
    render(filtered);
}

function toggleMenu() { document.getElementById('nav-menu').classList.toggle('hidden'); }
document.addEventListener('DOMContentLoaded', loadItems);
