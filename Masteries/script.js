document.addEventListener('DOMContentLoaded', () => {
    displayWeapons(waffenDaten);
});

function displayWeapons(waffen) {
    const container = document.getElementById('weapon-container');
    container.innerHTML = ''; // Container leeren

    waffen.forEach(waffe => {
        const card = document.createElement('div');
        card.className = 'spell-card';

        // Bestimme die Farbe des Tags basierend auf der Meisterschaft
        const tagClass = getTagClass(waffe.meistereigenschaft);

        card.innerHTML = `
            <div class="spell-header">
                <h3>${waffe.name}</h3>
                <span class="level-badge">${waffe.typ}</span>
            </div>
            <div class="spell-tags">
                <span class="tag ${tagClass}">${waffe.meistereigenschaft}</span>
            </div>
            <div class="meta">
                ${waffe.eigenschaften}<br>
                <em>${waffe.tags.join(', ')}</em>
            </div>
            <div class="spell-stats">
                <strong>Effekt:</strong> ${waffe.meisterEffekt}
            </div>
            <div class="spell-desc">
                <div class="desc-content">${waffe.beschreibung}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Hilfsfunktion für Farben
function getTagClass(mastery) {
    const mapping = {
        'Topple': 'concentration', // Orange/Rot
        'Nick': 'ritual',          // Blau
        'Sap': 'ritual',
        'Vex': 'concentration'
    };
    return mapping[mastery] || '';
}

// Filter-Funktion
function filterWeapons() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const masteryFilter = document.getElementById('mastery-filter').value.toLowerCase();

    const gefiltert = waffenDaten.filter(waffe => {
        const matchesSearch = waffe.name.toLowerCase().includes(searchTerm);
        const matchesMastery = masteryFilter === "" || waffe.meistereigenschaft.toLowerCase() === masteryFilter;
        return matchesSearch && matchesMastery;
    });

    displayWeapons(gefiltert);
}
