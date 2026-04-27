let weapons = [];

async function loadWeapons() {
    const res = await fetch('./data/weapons.json');
    weapons = await res.json();
    renderWeapons(weapons);
}

function renderWeapons(list) {
    const container = document.getElementById('weapon-list');
    container.innerHTML = '';

    list.forEach(w => {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
            <h3>${w.name}</h3>
            <p><b>Typ:</b> ${w.type === "Melee" ? "Nahkampf" : "Fernkampf"}</p>
            <p><b>Schaden:</b> ${w.damage}</p>
        `;

        div.onmouseenter = (e) => showTooltip(e, w.mastery);
        div.onmouseleave = hideTooltip;

        container.appendChild(div);
    });
}

function showTooltip(event, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('hidden');
    tooltip.innerText = text;

    tooltip.style.left = event.pageX + 10 + "px";
    tooltip.style.top = event.pageY + 10 + "px";
}

function hideTooltip() {
    document.getElementById('tooltip').classList.add('hidden');
}

function applyFilters() {
    const name = document.getElementById('searchName').value.toLowerCase();
    const type = document.getElementById('filterType').value;

    const filtered = weapons.filter(w => {
        return (!name || w.name.toLowerCase().includes(name)) &&
               (!type || w.type === type);
    });

    renderWeapons(filtered);
}

function resetFilters() {
    document.getElementById('searchName').value = '';
    document.getElementById('filterType').value = '';
    renderWeapons(weapons);
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

document.getElementById('searchName').addEventListener('input', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);

loadWeapons();
