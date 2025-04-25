/**
 * Kund AB - Cookiehantering
 * 
 * Detta script hanterar cookie-medgivande enligt kravspecifikationen.
 * Det visar ett medgivandemeddelande och lagrar användarens val.
 */

// Vänta tills dokumentet är redo
document.addEventListener('DOMContentLoaded', function() {
    // Cookie-hantering
    initCookieConsent();
});

/**
 * Initiera cookie-medgivande-systemet
 */
function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('accept-cookies');
    const customizeButton = document.getElementById('customize-cookies');
    
    // Kontrollera om användaren redan har gjort ett val
    if (!getCookie('cookie_consent')) {
        // Visa cookie-bannern efter en kort fördröjning
        setTimeout(function() {
            cookieBanner.classList.add('visible');
        }, 1000);
    }
    
    // Lyssna på acceptera-knappen
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            setAllCookiesAccepted();
            hideCookieBanner();
            logConsent('all');
        });
    }
    
    // Lyssna på anpassa-knappen
    if (customizeButton) {
        customizeButton.addEventListener('click', function() {
            showCookieSettings();
        });
    }
}

/**
 * Visa cookie-inställningar
 */
function showCookieSettings() {
    // Skapa modal för inställningar om den inte redan finns
    if (!document.getElementById('cookie-settings-modal')) {
        createCookieSettingsModal();
    }
    
    // Visa modal
    const modal = document.getElementById('cookie-settings-modal');
    modal.style.display = 'block';
}

/**
 * Skapa modal för cookie-inställningar
 */
function createCookieSettingsModal() {
    // Cookietyper som används på webbplatsen
    const cookieTypes = [
        {
            id: 'necessary',
            name: 'Nödvändiga cookies',
            description: 'Dessa cookies är nödvändiga för webbplatsens funktion och kan inte stängas av.',
            required: true
        },
        {
            id: 'preferences',
            name: 'Preferens-cookies',
            description: 'Dessa cookies gör det möjligt för webbplatsen att komma ihåg dina val och anpassa upplevelsen.',
            required: false
        },
        {
            id: 'statistics',
            name: 'Statistik-cookies',
            description: 'Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in anonym information.',
            required: false
        },
        {
            id: 'marketing',
            name: 'Marknadsförings-cookies',
            description: 'Dessa cookies används för att spåra besökare på webbplatser. Avsikten är att visa relevanta och engagerande annonser.',
            required: false
        }
    ];
    
    // Skapa modal element
    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.className = 'cookie-settings-modal';
    
    // Skapa modal innehåll
    let modalContent = `
        <div class="cookie-settings-content">
            <div class="cookie-settings-header">
                <h2>Cookie-inställningar</h2>
                <button class="cookie-settings-close" id="close-cookie-settings">&times;</button>
            </div>
            <div class="cookie-settings-body">
                <p>Vi använder cookies för att förbättra din upplevelse på vår webbplats. Nedan kan du välja vilka typer av cookies du godkänner.</p>
                <div class="cookie-options">
    `;
    
    // Lägg till alternativ för varje cookietyp
    cookieTypes.forEach(function(cookieType) {
        const checked = cookieType.required ? 'checked disabled' : '';
        
        modalContent += `
            <div class="cookie-option">
                <div class="cookie-option-header">
                    <label class="cookie-switch">
                        <input type="checkbox" id="${cookieType.id}-cookie" ${checked}>
                        <span class="cookie-slider"></span>
                    </label>
                    <h3>${cookieType.name}</h3>
                </div>
                <p>${cookieType.description}</p>
            </div>
        `;
    });
    
    // Lägg till knappar
    modalContent += `
                </div>
            </div>
            <div class="cookie-settings-footer">
                <button id="save-cookie-preferences" class="btn btn-primary">Spara inställningar</button>
                <button id="accept-all-cookies" class="btn btn-secondary">Acceptera alla</button>
            </div>
        </div>
    `;
    
    // Lägg till innehållet till modalen
    modal.innerHTML = modalContent;
    
    // Lägg till modal till body
    document.body.appendChild(modal);
    
    // Lägg till CSS-stilar för modalen
    const style = document.createElement('style');
    style.textContent = `
        .cookie-settings-modal {
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .cookie-settings-content {
            background-color: #fff;
            margin: 10% auto;
            padding: 0;
            border-radius: 8px;
            max-width: 600px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .cookie-settings-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .cookie-settings-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .cookie-settings-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #777;
        }
        
        .cookie-settings-body {
            padding: 1.5rem;
        }
        
        .cookie-options {
            margin-top: 1rem;
        }
        
        .cookie-option {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .cookie-option:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .cookie-option-header {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .cookie-option-header h3 {
            margin: 0 0 0 1rem;
        }
        
        .cookie-option p {
            margin: 0;
            padding-left: 3.5rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .cookie-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .cookie-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .cookie-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        
        .cookie-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .cookie-slider {
            background-color: var(--color-primary);
        }
        
        input:focus + .cookie-slider {
            box-shadow: 0 0 1px var(--color-primary);
        }
        
        input:checked + .cookie-slider:before {
            transform: translateX(26px);
        }
        
        .cookie-settings-footer {
            padding: 1rem 1.5rem;
            background-color: #f8f8f8;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            border-radius: 0 0 8px 8px;
        }
        
        @media (max-width: 767px) {
            .cookie-settings-content {
                margin: 20% auto;
                width: 90%;
            }
            
            .cookie-settings-footer {
                flex-direction: column;
            }
            
            .cookie-settings-footer button {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Koppla händelsehanterare
    document.getElementById('close-cookie-settings').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    document.getElementById('save-cookie-preferences').addEventListener('click', function() {
        saveUserPreferences();
        modal.style.display = 'none';
        hideCookieBanner();
    });
    
    document.getElementById('accept-all-cookies').addEventListener('click', function() {
        setAllCookiesAccepted();
        modal.style.display = 'none';
        hideCookieBanner();
        logConsent('all');
    });
    
    // Stäng modalen om användaren klickar utanför
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * Spara användarens cookie-inställningar
 */
function saveUserPreferences() {
    const preferences = {
        necessary: true, // Alltid nödvändig
        preferences: document.getElementById('preferences-cookie') ? document.getElementById('preferences-cookie').checked : false,
        statistics: document.getElementById('statistics-cookie') ? document.getElementById('statistics-cookie').checked : false,
        marketing: document.getElementById('marketing-cookie') ? document.getElementById('marketing-cookie').checked : false
    };
    
    // Sätt cookie med användarens val
    setCookie('cookie_consent', JSON.stringify(preferences), 365);
    
    // Logga användarens godkännande
    logConsent('custom');
}

/**
 * Markera alla cookies som accepterade
 */
function setAllCookiesAccepted() {
    const allAccepted = {
        necessary: true,
        preferences: true,
        statistics: true,
        marketing: true
    };
    
    // Sätt cookie med användarens val
    setCookie('cookie_consent', JSON.stringify(allAccepted), 365);
}

/**
 * Dölj cookie-banner
 */
function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookie-consent');
    if (cookieBanner) {
        cookieBanner.classList.remove('visible');
    }
}

/**
 * Logga användarens medgivande
 */
function logConsent(type) {
    // I en riktig implementation skulle detta logga användarens medgivande
    // till en databas eller annan lagringsplats
    console.log('Cookie consent logged: ' + type + ' at ' + new Date().toISOString());
}

/**
 * Hjälpfunktion för att sätta en cookie
 */
function setCookie(name, value, days) {
    let expires = '';
    
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
}

/**
 * Hjälpfunktion för att hämta en cookie
 */
function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    
    return null;
}