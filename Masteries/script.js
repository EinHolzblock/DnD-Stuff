let weapons = [];

/**
 * Initialization: Fetch data and setup listeners
 */
async function loadWeapons() {
    try {
        const res = await fetch('./data/weapons.json');
        if (!res.ok) throw new Error("Could not load weapon data");
        weapons = await res.json();
        
        // Populate the Mastery filter dropdown dynamically based on JSON data
        populateMasteryFilter();
        renderWeapons(weapons);
    } catch (err) {
        console.error("Error loading weapons:", err);
        document.getElementById('weapon-list').innerHTML = `<p style="color:red">Fehler beim Laden der Waffen.</p>`;
    }
}

/**
 * Populates the Mastery <select> with unique masteries found in the JSON
 */
function populateMasteryFilter() {
    const filter = document.getElementById('filterMastery');
    if (!filter) return;

    const masteries = [...new Set(weapons.map(w => {
        // Extracts the name before the colon if mastery is a string (e.g., "Push: Description")
        return typeof w.mastery === 'string' ? w.mastery.split(':')[0] : w.mastery.name;
    }))].sort();

    masteries.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.innerText = m;
        filter.appendChild(opt);
    });
}

/**
 * Main Render Function
 */
function renderWeapons(list) {
    const container = document.getElementById('weapon-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p>Keine Waffen gefunden, die diesen Kriterien entsprechen.</p>';
        return;
    }

    list.forEach(w => {
        const div = document.createElement('div');
        div.className = 'card';
        
        // Extract Mastery Name for display
        const masteryName = typeof w.mastery === 'string' ? w.mastery.split(':')[0] : w.mastery.name;
        const masteryFull = typeof w.mastery === 'string' ? w.mastery : `${w.mastery.name}: ${w.mastery.description}`;

        div.innerHTML = `
            <div class="card-header">
                <h3>${w.name}</h3>
                <span class="category-tag">${w.category || ''}</span>
            </div>
            <p><b>Typ:</b> ${w.type === "Melee" ? "⚔️ Nahkampf" : "🏹 Fernkampf"}</p>
            <p><b>Schaden:</b> ${w.damage}</p>
            <p class="properties"><i>${Array.isArray(w.properties) ? w.properties.join(', ') : w.properties || ''}</i></p>
            <div class="mastery-tag">✨ ${masteryName}</div>
        `;

        // Tooltip Events
        div.onmouseenter = (e) => showTooltip(e, masteryFull);
        div.onmousemove = (e) => moveTooltip(e); // Added for smoother movement
        div.onmouseleave = hideTooltip;

        container.appendChild(div);
    });
}

/**
 * Advanced Filtering Logic
 */
function applyFilters() {
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const searchMastery = document.getElementById('searchMastery').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    const filterMastery = document.getElementById('filterMastery').value;

    const filtered = weapons.filter(w => {
        const masteryStr = typeof w.mastery === 'string' ? w.mastery : w.mastery.name;
        
        const matchesName = !searchName || w.name.toLowerCase().includes(searchName);
        const matchesType = !filterType || w.type === filterType;
        const matchesMasterySearch = !searchMastery || masteryStr.toLowerCase().includes(searchMastery);
        const matchesMasterySelect = !filterMastery || masteryStr.startsWith(filterMastery);

        return matchesName && matchesType && matchesMasterySearch && matchesMasterySelect;
    });

    renderWeapons(filtered);
}

/**
 * Tooltip UI Helpers
 */
function showTooltip(event, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `<strong>Meisterschaftseigenschaft:</strong><br>${text}`;
    tooltip.classList.remove('hidden');
    moveTooltip(event);
}

function moveTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    // Offset by 15px to keep it away from the cursor
    tooltip.style.left = event.pageX + 15 + "px";
    tooltip.style.top = event.pageY + 15 + "px";
}

function hideTooltip() {
    document.getElementById('tooltip').classList.add('hidden');
}

/**
 * Reset and Navigation
 */
function resetFilters() {
    document.querySelectorAll('.filter-group input, .filter-group select').forEach(el => el.value = '');
    renderWeapons(weapons);
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

// Event Listeners for Live Search
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchName').addEventListener('input', applyFilters);
    document.getElementById('searchMastery').addEventListener('input', applyFilters);
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterMastery').addEventListener('change', applyFilters);
    
    loadWeapons();
});
