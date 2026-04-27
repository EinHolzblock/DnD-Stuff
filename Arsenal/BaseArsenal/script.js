let items = [];
let masteryData = []; // Store descriptions here

async function loadData() {
    try {
        console.log("Attempting to fetch data...");
        const [itemRes, masteryRes] = await Promise.all([
            fetch('./data/items.json'),
            fetch('../../Masteries/data/mastery-desc.json')
        ]);
        
        if (!itemRes.ok) throw new Error("Could not find items.json");
        if (!masteryRes.ok) throw new Error("Could not find mastery-desc.json");

        items = await itemRes.json();
        masteryData = await masteryRes.json();
        
        console.log("Data loaded successfully:", { items, masteryData });
        render(items);
    } catch (err) {
        console.error("Critical Load Error:", err);
    }
}

function openMasteryModal(masteryName) {
    const modal = document.getElementById('mastery-modal');
    const body = document.getElementById('modal-body');
    
    // Find the description in our stored data
    const info = masteryData.find(m => m.name.toLowerCase() === masteryName.toLowerCase());

    if (info) {
        body.innerHTML = `
            <h2 style="color: #d4af37; margin-top: 0;">✨ ${info.name}</h2>
            <p style="font-style: italic; color: #888;">${info.translation}</p>
            <hr style="border: 0; border-top: 1px solid #444;">
            <p><strong>Voraussetzung:</strong> ${info.requirement || 'Keine'}</p>
            <p style="line-height: 1.6;">${info.description}</p>
        `;
    } else {
        body.innerHTML = `<p>Keine Details zu "${masteryName}" gefunden.</p>`;
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('mastery-modal').classList.add('hidden');
}

// Update your render function to use a button instead of a link
function render(list) {
    const container = document.getElementById('item-grid');
    container.innerHTML = '';

    list.forEach(i => {
        const div = document.createElement('div');
        div.className = 'card';
        
        // 1. Determine specific details based on category
        let details = "";
        if (i.category === "Weapon") {
            details = `<p><b>Schaden:</b> ${i.damage || '-'}</p>`;
        } else if (i.category === "Armor") {
            details = `<p><b>RK (AC):</b> ${i.ac || '-'}</p>`;
        } else {
            // For general gear, show description if properties is empty
            details = i.description ? `<p class="description-text">${i.description}</p>` : "";
        }

        // 2. Setup the Mastery button
        const masteryBtn = i.mastery 
            ? `<button class="mastery-tag" onclick="openMasteryModal('${i.mastery}')" style="cursor: pointer; border: 1px solid #663333; margin-top: 10px; width: 100%;">
                 ✨ ${i.mastery} (Info)
               </button>` 
            : '';

        // 3. Assemble the card
        div.innerHTML = `
            <div class="card-content">
                <h3>${i.name}</h3>
                <p><b>Typ:</b> ${i.type}</p>
                <p><b>Preis:</b> ${i.cost || '-'} | <b>Gewicht:</b> ${i.weight || '-'}</p>
                
                ${details} 
                
                <p class="description-text">${i.properties || ''}</p>
            </div>
            
            ${masteryBtn}
            
            <span class="source-tag" style="display: block; margin-top: 10px;">${i.source}</span>
        `;
        container.appendChild(div);
    });
}
function applyFilters() {
    const nameSearch = document.getElementById('searchName').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;

    const filtered = items.filter(i => {
        const matchesName = i.name.toLowerCase().includes(nameSearch);
        const matchesType = typeFilter === "" || i.category === typeFilter || i.type === typeFilter;
        return matchesName && matchesType;
    });

    render(filtered);
}
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}
document.addEventListener('DOMContentLoaded', loadData);
