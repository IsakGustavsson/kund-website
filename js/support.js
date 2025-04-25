/**
 * Kund AB - Supportfunktionalitet
 * 
 * Detta script hanterar supportformuläret, fjärrsupport och driftstatusinformation
 */

// Vänta tills dokumentet är redo
document.addEventListener('DOMContentLoaded', function() {
    // Initiera supportformulär
    const supportForm = document.getElementById('support-form');
    if (supportForm) {
        initSupportForm(supportForm);
    }
    
    // Initiera fjärrsupport
    const remoteButton = document.getElementById('remote-support-btn');
    if (remoteButton) {
        initRemoteSupport(remoteButton);
    }
    
    // Initiera FAQ-accordions
    initFaqAccordions();
    
    // Initiera driftstatusinformation
    initServiceStatus();
});

/**
 * Initierar supportformulärets funktionalitet
 * @param {HTMLFormElement} form - Formulärelementet som ska initieras
 */
function initSupportForm(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateSupportForm(form)) {
            // Simulera formulärinlämning (ersätts med faktisk AJAX i produktion)
            submitSupportForm(form);
        }
    });
    
    // Lägg till livevalidering på formulärfält
    const formInputs = form.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        // För select-element, validera även vid förändring
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                validateField(input);
            });
        }
    });
    
    // Hantera filuppladdning
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            validateFileUpload(fileInput);
        });
    }
}

/**
 * Validerar ett enskilt fält
 * @param {HTMLElement} field - Fältet som ska valideras
 * @returns {boolean} Sant om fältet är giltigt
 */
function validateField(field) {
    // Ta bort tidigare felmeddelanden
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Återställ fältstil
    field.classList.remove('error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Kontrollera om fältet är obligatoriskt och tomt
    if (field.required && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Detta fält är obligatoriskt';
    } 
    // Validera e-post
    else if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
            isValid = false;
            errorMessage = 'Vänligen ange en giltig e-postadress';
        }
    }
    // Validera telefonnummer (om angivet)
    else if (field.type === 'tel' && field.value.trim()) {
        const phonePattern = /^[+\d\s\-()]{6,20}$/;
        if (!phonePattern.test(field.value)) {
            isValid = false;
            errorMessage = 'Vänligen ange ett giltigt telefonnummer';
        }
    }
    // Validera kryssrutor
    else if (field.type === 'checkbox' && field.required && !field.checked) {
        isValid = false;
        errorMessage = 'Du måste godkänna villkoren';
    }
    
    // Visa felmeddelande om fältet är ogiltigt
    if (!isValid) {
        field.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = errorMessage;
        field.parentNode.appendChild(errorSpan);
    }
    
    return isValid;
}

/**
 * Validerar filuppladdningar
 * @param {HTMLInputElement} fileInput - Filuppladdningsfältet
 * @returns {boolean} Sant om filerna är giltiga
 */
function validateFileUpload(fileInput) {
    // Ta bort tidigare felmeddelanden
    const existingError = fileInput.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Återställ fältstil
    fileInput.classList.remove('error');
    
    if (fileInput.files.length === 0) {
        return true; // Ingen fil är OK eftersom det är valfritt
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    let isValid = true;
    let errorMessage = '';
    
    // Kontrollera varje fil
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        
        // Kontrollera filstorlek
        if (file.size > maxSize) {
            isValid = false;
            errorMessage = 'En eller flera filer överskrider den maximala filstorleken (10MB)';
            break;
        }
        
        // Kontrollera filtyp
        if (!allowedTypes.includes(file.type)) {
            isValid = false;
            errorMessage = 'En eller flera filer har ett format som inte stöds';
            break;
        }
    }
    
    // Visa felmeddelande om filerna är ogiltiga
    if (!isValid) {
        fileInput.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = errorMessage;
        fileInput.parentNode.appendChild(errorSpan);
    }
    
    return isValid;
}

/**
 * Validerar hela supportformuläret
 * @param {HTMLFormElement} form - Formuläret som ska valideras
 * @returns {boolean} Sant om formuläret är giltigt
 */
function validateSupportForm(form) {
    const formFields = form.querySelectorAll('input:not([type="file"]), textarea, select');
    const fileInput = form.querySelector('input[type="file"]');
    
    let isValid = true;
    
    // Validera alla vanliga fält
    formFields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validera filuppladdningen om den finns
    if (fileInput && !validateFileUpload(fileInput)) {
        isValid = false;
    }
    
    return isValid;
}

/**
 * Skickar supportformuläret (simulerad)
 * @param {HTMLFormElement} form - Formuläret som ska skickas
 */
function submitSupportForm(form) {
    // Visa laddningsindikator
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skickar...';
    
    // Simulera en AJAX-förfrågan
    setTimeout(function() {
        // Ta bort laddningsindikator
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Visa bekräftelsemeddelande
        showSupportFormConfirmation(form);
        
        // Återställ formuläret
        form.reset();
    }, 1500);
}

/**
 * Visar bekräftelsemeddelande efter lyckad formulärinlämning
 * @param {HTMLFormElement} form - Formuläret som har skickats
 */
function showSupportFormConfirmation(form) {
    // Skapa bekräftelsemeddelande
    const confirmationMessage = document.createElement('div');
    confirmationMessage.className = 'form-confirmation';
    confirmationMessage.innerHTML = `
        <div class="confirmation-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Tack för ditt supportärende!</h3>
        <p>Vi har tagit emot ditt ärende och kommer att kontakta dig så snart som möjligt enligt våra SLA-tider.</p>
        <p>Ditt ärendenummer är: <strong>SUP-${Math.floor(100000 + Math.random() * 900000)}</strong></p>
        <p>En bekräftelse har skickats till din e-post.</p>
        <button class="btn btn-outline close-confirmation">Stäng</button>
    `;
    
    // Lägg till bekräftelsemeddelande till DOM
    const formContainer = form.parentNode;
    formContainer.appendChild(confirmationMessage);
    
    // Dölj formuläret tillfälligt
    form.style.display = 'none';
    
    // Hantera knappen för att stänga bekräftelsemeddelandet
    const closeButton = confirmationMessage.querySelector('.close-confirmation');
    closeButton.addEventListener('click', function() {
        // Ta bort bekräftelsemeddelande
        confirmationMessage.remove();
        
        // Visa formuläret igen
        form.style.display = '';
    });
}

/**
 * Initiera fjärrsupport
 * @param {HTMLElement} button - Knappen som startar fjärrsupport
 */
function initRemoteSupport(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Visa modal med instruktioner
        showRemoteSupportModal();
    });
}

/**
 * Visar modal för fjärrsupport
 */
function showRemoteSupportModal() {
    // Skapa modal element
    const modal = document.createElement('div');
    modal.className = 'remote-support-modal';
    modal.innerHTML = `
        <div class="remote-support-content">
            <div class="remote-support-header">
                <h2>Starta fjärrsupport</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="remote-support-body">
                <p>För att starta fjärrsupport, följ dessa steg:</p>
                <ol>
                    <li>Klicka på knappen "Ladda ner fjärrsupportklient" nedan.</li>
                    <li>Kör den nedladdade filen när nedladdningen är klar.</li>
                    <li>Tillåt programmet att göra ändringar i ditt system om du blir tillfrågad.</li>
                    <li>Dela ID-numret som visas med vår supporttekniker via telefon eller e-post.</li>
                </ol>
                <div class="text-center">
                    <a href="#" class="btn btn-primary download-remote-client">
                        <i class="fas fa-download"></i> Ladda ner fjärrsupportklient
                    </a>
                </div>
                <p class="info-text">
                    <i class="fas fa-info-circle"></i> Vi använder TeamViewer för fjärrsupport, en säker och pålitlig lösning som låter oss se och kontrollera din dator för att lösa problem.
                </p>
            </div>
        </div>
    `;
    
    // Lägg till modal till body
    document.body.appendChild(modal);
    
    // Lägg till CSS-stilar för modalen
    const style = document.createElement('style');
    style.textContent = `
        .remote-support-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .remote-support-content {
            background-color: #fff;
            border-radius: var(--border-radius-md);
            width: 90%;
            max-width: 500px;
            box-shadow: var(--shadow-large);
        }
        
        .remote-support-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .remote-support-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #777;
        }
        
        .remote-support-body {
            padding: 1.5rem;
        }
        
        .remote-support-body ol {
            margin-bottom: 1.5rem;
        }
        
        .remote-support-body .text-center {
            margin: 1.5rem 0;
        }
        
        .info-text {
            font-size: 0.9rem;
            color: #666;
            background-color: #f8f8f8;
            padding: 1rem;
            border-radius: var(--border-radius-sm);
            margin-top: 1rem;
        }
    `;
    
    document.head.appendChild(style);
    
    // Hantera stängknappen
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        modal.remove();
        style.remove();
    });
    
    // Hantera knappen för att ladda ner klienten (simulerad)
    const downloadButton = modal.querySelector('.download-remote-client');
    downloadButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Simulera nedladdning
        alert('Fjärrsupportklienten laddas ned...\n\nI en verklig implementation skulle detta starta nedladdningen av TeamViewer QuickSupport eller liknande.');
    });
    
    // Stäng modalen om användaren klickar utanför
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

/**
 * Initierar FAQ-accordions
 */
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', function() {
                // Kontrollera om denna fråga är öppen
                const isOpen = item.classList.contains('active');
                
                // Stäng alla andra frågor
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherToggle = otherItem.querySelector('.faq-toggle i');
                        
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = null;
                        }
                        
                        if (otherToggle) {
                            otherToggle.className = 'fas fa-plus';
                        }
                    }
                });
                
                // Öppna/stäng den klickade frågan
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                    toggle.querySelector('i').className = 'fas fa-plus';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.querySelector('i').className = 'fas fa-minus';
                }
            });
        }
    });
}

/**
 * Initierar driftstatusinformation
 */
function initServiceStatus() {
    const statusOverview = document.querySelector('.status-overview');
    const systemsStatus = document.querySelector('.systems-status');
    const incidentsContainer = document.getElementById('incidents');
    
    if (!statusOverview || !systemsStatus || !incidentsContainer) {
        return;
    }
    
    // Simulera driftstatuskontroll (exempel)
    // I en verklig implementation skulle denna data hämtas från ett API eller databas
    const currentStatus = {
        overall: 'operational', // operational, degraded, major_incident
        systems: [
            { name: 'E-postsystem', status: 'operational' },
            { name: 'Webbhotell', status: 'operational' },
            { name: 'Molntjänster', status: 'operational' },
            { name: 'Support-portal', status: 'operational' },
            { name: 'Fjärrsupport', status: 'operational' }
        ],
        incidents: []
    };
    
    // Uppdatera övergripande status
    updateOverallStatus(statusOverview, currentStatus.overall);
    
    // Uppdatera system status
    updateSystemsStatus(systemsStatus, currentStatus.systems);
    
    // Visa eventuella incidenter
    if (currentStatus.incidents.length > 0) {
        showIncidents(incidentsContainer, currentStatus.incidents);
    }
}

/**
 * Uppdaterar övergripande driftstatus
 * @param {HTMLElement} container - Elementet som innehåller övergripande status
 * @param {string} status - Statuskod (operational, degraded, major_incident)
 */
function updateOverallStatus(container, status) {
    const statusIndicator = container.querySelector('.status-indicator');
    const statusText = container.querySelector('.status-text');
    
    // Ta bort befintliga statusklasser
    statusIndicator.classList.remove('operational', 'degraded', 'major-incident');
    
    // Lägg till rätt statusklass och uppdatera text
    switch (status) {
        case 'operational':
            statusIndicator.classList.add('operational');
            statusText.textContent = 'Alla system fungerar normalt';
            break;
        case 'degraded':
            statusIndicator.classList.add('degraded');
            statusText.textContent = 'Vissa system har begränsad funktionalitet';
            break;
        case 'major_incident':
            statusIndicator.classList.add('major-incident');
            statusText.textContent = 'Större driftstörning pågår';
            break;
    }
}

/**
 * Uppdaterar status för individuella system
 * @param {HTMLElement} container - Elementet som innehåller systemstatuset
 * @param {Array} systems - Lista med systemobjekt
 */
function updateSystemsStatus(container, systems) {
    const statusItems = container.querySelectorAll('.status-item');
    
    systems.forEach(function(system, index) {
        if (index < statusItems.length) {
            const statusBadge = statusItems[index].querySelector('.status-badge');
            
            // Ta bort befintliga statusklasser
            statusBadge.classList.remove('operational', 'degraded', 'major-incident');
            
            // Lägg till rätt statusklass och uppdatera text
            switch (system.status) {
                case 'operational':
                    statusBadge.classList.add('operational');
                    statusBadge.textContent = 'Fungerar';
                    break;
                case 'degraded':
                    statusBadge.classList.add('degraded');
                    statusBadge.textContent = 'Begränsad';
                    break;
                case 'down':
                    statusBadge.classList.add('major-incident');
                    statusBadge.textContent = 'Ur funktion';
                    break;
            }
        }
    });
}

/**
 * Visar incidenter
 * @param {HTMLElement} container - Elementet som ska innehålla incidenterna
 * @param {Array} incidents - Lista med incidentobjekt
 */
function showIncidents(container, incidents) {
    // Rensa befintligt innehåll
    container.innerHTML = '';
    
    // Lägg till rubrik
    const header = document.createElement('h3');
    header.textContent = 'Pågående driftstörningar';
    container.appendChild(header);
    
    // Lägg till varje incident
    incidents.forEach(function(incident) {
        const incidentCard = document.createElement('div');
        incidentCard.className = `incident-card ${incident.severity}`;
        
        incidentCard.innerHTML = `
            <div class="incident-header">
                <span class="incident-severity">${getSeverityText(incident.severity)}</span>
                <span class="incident-time">${incident.time}</span>
            </div>
            <h4 class="incident-title">${incident.title}</h4>
            <div class="incident-description">${incident.description}</div>
            <div class="incident-affected">
                <strong>Påverkade system:</strong> ${incident.affectedSystems.join(', ')}
            </div>
        `;
        
        container.appendChild(incidentCard);
    });
}

/**
 * Konverterar allvarlighetsgrad till användarvänlig text
 * @param {string} severity - Allvarlighetsgraden (low, medium, high)
 * @returns {string} - Användarvänlig text
 */
function getSeverityText(severity) {
    switch (severity) {
        case 'low':
            return 'Mindre problem';
        case 'medium':
            return 'Medelallvarligt problem';
        case 'high':
            return 'Allvarligt problem';
        default:
            return 'Problem';
    }
}