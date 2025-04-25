/**
 * Kund AB - Huvudsakliga JavaScript-funktioner
 * 
 * Detta är den centrala JavaScript-filen för webbplatsen.
 * Den hanterar navigation, bildspel och andra interaktiva element.
 */

// Vänta tills dokumentet är redo
document.addEventListener('DOMContentLoaded', function() {
    // Hantera mobil meny
    setupMobileMenu();
    
    // Hantera undermenyer på mobil
    setupSubmenuToggle();
    
    // Intialisera bildspel för kundcase
    initCaseSlider();
    
    // Lazyladdning av bilder
    setupLazyLoading();
});

/**
 * Hantera mobil meny
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');
    
    if (!menuToggle || !mainNavigation) return;
    
    menuToggle.addEventListener('click', function() {
        // Toggla menyn
        mainNavigation.classList.toggle('active');
        
        // Uppdatera aria-expanded för tillgänglighet
        const expanded = mainNavigation.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded);
        
        // Ändra utseende på hamburgermenyn
        this.classList.toggle('active');
    });
    
    // Stäng menyn när man klickar utanför
    document.addEventListener('click', function(event) {
        if (
            !event.target.closest('.main-navigation') && 
            !event.target.closest('.menu-toggle') && 
            mainNavigation.classList.contains('active')
        ) {
            mainNavigation.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Hantera undermenyer på mobil
 */
function setupSubmenuToggle() {
    const hasChildrenMenuItems = document.querySelectorAll('.menu-item.has-children');
    
    hasChildrenMenuItems.forEach(item => {
        // Endast för mobila enheter
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        
        if (mediaQuery.matches) {
            const link = item.querySelector('a');
            
            link.addEventListener('click', function(e) {
                // Endast om vi är på mobil
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
        
        // Lyssna på förändringar i skärmstorlek
        mediaQuery.addEventListener('change', function(e) {
            if (!e.matches) {
                item.classList.remove('active');
            }
        });
    });
}

/**
 * Hantera bildspel för kundcase
 */
function initCaseSlider() {
    const slider = document.querySelector('.case-slider');
    if (!slider) return;
    
    const dots = slider.querySelectorAll('.dot');
    const prevButton = slider.querySelector('.case-prev');
    const nextButton = slider.querySelector('.case-next');
    
    // Simulerar olika kundcase (skulle ersättas av faktisk data i en riktig implementation)
    const cases = [
        {
            title: 'Företag A: Digital transformation',
            description: 'Vi hjälpte Företag A att modernisera sin IT-infrastruktur och implementera en molnbaserad lösning för hela organisationen.',
            image: 'img/case-1.jpg',
            link: 'case/foretag-a.html'
        },
        {
            title: 'Företag B: Ny webbplats',
            description: 'Vi utvecklade en ny responsiv webbplats till Företag B med fokus på användarupplevelse och konvertering.',
            image: 'img/case-2.jpg',
            link: 'case/foretag-b.html'
        },
        {
            title: 'Företag C: IT-säkerhetslösning',
            description: 'Vi implementerade en omfattande säkerhetslösning för att skydda Företag C:s känsliga kunddata och affärsinformation.',
            image: 'img/case-3.jpg',
            link: 'case/foretag-c.html'
        }
    ];
    
    let currentIndex = 0;
    
    // Uppdatera kundcaset
    function updateCase(index) {
        const caseCard = slider.querySelector('.case-card');
        const caseData = cases[index];
        
        // Uppdatera bild
        const caseImage = caseCard.querySelector('.case-image img');
        caseImage.src = caseData.image;
        caseImage.alt = caseData.title;
        
        // Uppdatera innehåll
        const caseTitle = caseCard.querySelector('h3');
        caseTitle.textContent = caseData.title;
        
        const caseDesc = caseCard.querySelector('p');
        caseDesc.textContent = caseData.description;
        
        const caseLink = caseCard.querySelector('a');
        caseLink.href = caseData.link;
        
        // Uppdatera aktiv dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Lyssna på klick på prev-knapp
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = cases.length - 1;
            }
            updateCase(newIndex);
        });
    }
    
    // Lyssna på klick på next-knapp
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            let newIndex = currentIndex + 1;
            if (newIndex >= cases.length) {
                newIndex = 0;
            }
            updateCase(newIndex);
        });
    }
    
    // Lyssna på klick på dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', function() {
            updateCase(i);
        });
    });
    
    // Automatisk rotation (inaktiverad som standard för bättre tillgänglighet)
    // Avkommentera för att aktivera
    /*
    setInterval(function() {
        let newIndex = currentIndex + 1;
        if (newIndex >= cases.length) {
            newIndex = 0;
        }
        updateCase(newIndex);
    }, 5000);
    */
}

/**
 * Lazy-laddning av bilder för bättre prestanda
 */
function setupLazyLoading() {
    // Kontrollera om Intersection Observer API är tillgängligt
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        // Fallback för äldre webbläsare
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        function lazyLoad() {
            lazyImages.forEach(function(img) {
                if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            
            // Om alla bilder är laddade, sluta lyssna på scroll-event
            if (lazyImages.length === 0) {
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationChange', lazyLoad);
            }
        }
        
        // Lyssna på händelser för att upptäcka när bilder blir synliga
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
}