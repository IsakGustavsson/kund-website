/**
 * Kund AB - Kontaktformulärsfunktionalitet
 * 
 * Detta script hanterar kontaktformuläret, validering och inlämning.
 */

// Vänta tills dokumentet är redo
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        initContactForm(contactForm);
    }
    
    // Initiera FAQ-funktionalitet
    initFaq();
});

/**
 * Initierar kontaktformulärets funktionalitet
 * @param {HTMLFormElement} form - Formulärelementet som ska initieras
 */
function initContactForm(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validera formuläret
        if (validateForm(form)) {
            // Simulera formulärinlämning (ersätts med faktisk AJAX i produktion)
            submitForm(form);
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
}

/**
 * Validerar ett enskilt formulärfält
 * @param {HTMLElement} field - Fältet som ska valideras
 * @returns {boolean} - Sant om fältet är giltigt
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
 * Validerar hela formuläret
 * @param {HTMLFormElement} form - Formuläret som ska valideras
 * @returns {boolean} - Sant om formuläret är giltigt
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Skickar formuläret (simulerad)
 * @param {HTMLFormElement} form - Formuläret som ska skickas
 */
function submitForm(form) {
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
        showFormConfirmation(form);
        
        // Återställ formuläret
        form.reset();
    }, 1500);
}

/**
 * Visar bekräftelsemeddelande efter lyckad formulärinlämning
 * @param {HTMLFormElement} form - Formuläret som har skickats
 */
function showFormConfirmation(form) {
    // Skapa bekräftelsemeddelande
    const confirmationMessage = document.createElement('div');
    confirmationMessage.className = 'form-confirmation';
    confirmationMessage.innerHTML = `
        <div class="confirmation-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Tack för ditt meddelande!</h3>
        <p>Vi har tagit emot ditt meddelande och kommer att kontakta dig inom kort.</p>
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
 * Initierar FAQ-accordions-funktionalitet
 */
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            // Kontrollera om denna fråga är öppen
            const isOpen = item.classList.contains('active');
            
            // Stäng alla andra frågor
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
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
    });
}