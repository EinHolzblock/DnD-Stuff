let waffenDaten = []; // Globaler Speicher für die geladenen Daten

// 1. Daten beim Laden der Seite abrufen
document.addEventListener('DOMContentLoaded', () => {
    fetch('weapons.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP Fehler " + response.status);
            }
            return response.json();
        })
        .then(data => {
            waffenDaten = data;
            displayWeapons(waffenDaten);
        })
        .catch(error => {
            console.error("Fehler beim Laden der JSON:", error);
            document.getElementById('weapon-container').innerHTML = 
                `<p style="color: red;">Fehler beim Laden der Waffendaten.</p>`;
        });
});

// 2. Waffen im HTML anzeigen
function displayWeapons(waffen) {
    const container = document.getElementById('weapon-container');
    container.innerHTML = ''; 

    waffen.forEach(waffe => {
        const card = document.createElement('div');
        card.className = 'spell-card';

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
                <strong>Schaden:</strong> ${waffe.schaden}<br>
                <strong>Eigenschaften:</strong> ${waffe.eigenschaften}
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

// 3. Filter-Logik
function filterWeapons() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const masteryFilter = document.getElementById('mastery-filter').value.toLowerCase();

    const gefiltert = waffenDaten.filter(waffe => {
        const matchesSearch = waffe.name.toLowerCase().includes(searchTerm);
        const matchesMastery = masteryFilter === "" || 
                               waffe.meistereigenschaft.toLowerCase().includes(masteryFilter);
        return matchesSearch && matchesMastery;
    });

    displayWeapons(gefiltert);
}

// 4. Hilfsfunktionen
function getTagClass(mastery) {
    const m = mastery.toLowerCase();
    if (m.includes('nick') || m.includes('vex') || m.includes('slow')) return 'ritual'; // Blau
    if (m.includes('topple') || m.includes('push') || m.includes('cleave')) return 'concentration'; // Orange
    return '';
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}
