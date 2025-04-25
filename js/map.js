/**
 * Kund AB - Kartfunktionalitet
 * 
 * Detta script hanterar kartfunktionaliteten på kontaktsidan.
 * Använder Leaflet.js för att visa karta med kontorsplatser.
 */

// Vänta tills dokumentet är redo
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('contact-map');
    
    if (mapContainer) {
        initMap(mapContainer);
    }
});

/**
 * Initierar kartan
 * @param {HTMLElement} container - Elementet som ska innehålla kartan
 */
function initMap(container) {
    // Definiera kontorsplatser
    const offices = [
        {
            name: 'Stockholm (Huvudkontor)',
            address: 'Sveavägen 100, 113 50 Stockholm',
            lat: 59.3426, // Koordinater för Stockholm
            lng: 18.0562,
            phone: '08-123 45 67',
            email: 'stockholm@kund.se'
        },
        {
            name: 'Göteborg',
            address: 'Avenyn 50, 411 38 Göteborg',
            lat: 57.7013, // Koordinater för Göteborg
            lng: 11.9675,
            phone: '031-123 45 67',
            email: 'goteborg@kund.se'
        },
        {
            name: 'Malmö',
            address: 'Stortorget 10, 211 22 Malmö',
            lat: 55.6054, // Koordinater för Malmö
            lng: 13.0038,
            phone: '040-123 45 67',
            email: 'malmo@kund.se'
        }
    ];
    
    // Skapa karta centrerad på Sverige
    const map = L.map(container).setView([62.0, 15.0], 5);
    
    // Lägg till OpenStreetMap-lager
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Skapa anpassad markörikonen
    const officeIcon = L.icon({
        iconUrl: '../img/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: '../img/marker-shadow.png',
        shadowSize: [41, 41]
    });
    
    // Lägg till markörer för varje kontor
    const markers = [];
    
    offices.forEach(function(office) {
        const marker = L.marker([office.lat, office.lng], { icon: officeIcon })
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <h3>${office.name}</h3>
                    <p>${office.address}</p>
                    <p>Tel: ${office.phone}<br>E-post: ${office.email}</p>
                </div>
            `);
        
        markers.push(marker);
    });
    
    // Anpassa kartan för att visa alla markörer
    const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
    map.fitBounds(bounds, { padding: [50, 50] });
    
    // Responsiv hantering
    window.addEventListener('resize', function() {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [50, 50] });
    });
    
    // Lägg till CSS-stilar för popup
    const style = document.createElement('style');
    style.textContent = `
        .map-popup h3 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 1rem;
        }
        
        .map-popup p {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .leaflet-popup-content-wrapper {
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
}