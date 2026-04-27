/**
 * Mastery Descriptions Loader
 * Purpose: Fetches mastery rules and renders them as cards.
 */

async function loadMasteryDescriptions() {
    const container = document.getElementById('mastery-info-grid');
    
    try {
        const res = await fetch('./data/mastery-desc.json');
        if (!res.ok) throw new Error("Could not load mastery descriptions.");
        
        const data = await res.json();
        renderMasteryCards(data);
    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = `<p style="color:red">Fehler beim Laden der Beschreibungen.</p>`;
    }
}

function renderMasteryCards(masteries) {
    const container = document.getElementById('mastery-info-grid');
    container.innerHTML = '';

    masteries.forEach(m => {
        const div = document.createElement('div');
        div.className = 'card';

        // Using your existing CSS architecture
        div.innerHTML = `
            <div class="card-header">
                <h3>${m.name} <span style="color: #888; font-size: 0.8em;">(${m.translation})</span></h3>
            </div>
            <p><strong>Voraussetzung:</strong> ${m.requirement || 'Keine'}</p>
            <hr style="border: 0; border-top: 1px solid #444; margin: 10px 0;">
            <p class="description-text">${m.description}</p>
            <div class="mastery-tag">Regelwerk 2024</div>
        `;

        container.appendChild(div);
    });
}

// Hamburger Menu Logic (copied for standalone functionality)
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', loadMasteryDescriptions);
