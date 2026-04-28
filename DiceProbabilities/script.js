function calculateStats() {
    const count = parseInt(document.getElementById('diceCount').value);
    const sides = parseInt(document.getElementById('diceType').value);
    
    if (isNaN(count) || count < 1) return;

    // 1. Calculate Average: n * ((sides + 1) / 2)
    const average = count * ((sides + 1) / 2);
    
    // 2. Calculate Range
    const min = count;
    const max = count * sides;

    // 3. Update UI
    document.getElementById('displayRoll').innerText = `${count}d${sides}`;
    document.getElementById('avg-val').innerText = average.toFixed(1);
    document.getElementById('range-val').innerText = `${min} - ${max}`;

    // 4. Reliability Logic (Chaos vs. Bell Curve)
    const relTag = document.getElementById('reliability-tag');
    relTag.className = 'mastery-tag'; // reset

    if (count === 1) {
        relTag.innerText = "Reliability: Chaos (Flat)";
        relTag.classList.add('rel-low');
    } else if (count >= 2 && count <= 3) {
        relTag.innerText = "Reliability: Balanced";
        relTag.classList.add('rel-med');
    } else {
        relTag.innerText = "Reliability: High (Bell Curve)";
        relTag.classList.add('rel-high');
    }
}

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('hidden');
}

// Run once on load
window.onload = calculateStats;
