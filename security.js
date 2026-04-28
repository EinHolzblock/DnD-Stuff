document.addEventListener("DOMContentLoaded", () => {
    const authorizedDomain = "einholzblock.github.io"; // Deine Domain
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    // 1. Prüfen, ob wir auf einer fremden Domain sind
    if (!window.location.hostname.includes(authorizedDomain) && !isLocal) {
        
        // 2. Suchen, ob ein Link zu deinem GitHub existiert
        const creditsExist = Array.from(document.querySelectorAll('a')).some(link => 
            link.href.includes("github.com/EinHolzblock") || 
            link.innerText.toLowerCase().includes("einholzblock")
        );

        // 3. Wenn kein Credit gefunden wurde -> Falle aktivieren
        if (!creditsExist) {
            console.warn("Unauthorized mirror detected. Missing attribution.");
            
            // UI sperren und Nachricht anzeigen
            document.body.innerHTML = `
                <div style="background:#1a1625; color:#ff5555; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; padding:20px; text-align:center;">
                    <h1 style="color:#9d4edd;">⚔️ DnD Workshop</h1>
                    <p style="font-size:1.2rem; color:#e0e0e0;">Diese Seite ist eine unautorisierte Kopie ohne Urhebernachweis.</p>
                    <p style="color:#a0a0a0;">Unterstütze den Ersteller und besuche das Original:</p>
                    <a href="https://${authorizedDomain}" style="background:#9d4edd; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; margin-top:20px;">Zum Original von EinHolzblock</a>
                </div>
            `;
        } else {
            // Wenn der Credit da ist, loggen wir nur eine kleine Nachricht in die Konsole (für dich)
            console.log("Mirror recognized. Attribution found. Thank you for the credit!");
        }
    }
});
