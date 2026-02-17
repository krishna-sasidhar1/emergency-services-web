/**
 * Map Logic using Leaflet.js
 */

let map = null;
let userMarker = null;
let resourceMarkers = [];

// Custom Icons
const createIcon = (type) => {
    let color = '#FF4757'; // Red default
    let iconClass = 'ri-map-pin-fill';

    if (type === 'hospital') { color = '#FF4757'; iconClass = 'ri-hospital-fill'; }
    if (type === 'ambulance') { color = '#FFA502'; iconClass = 'ri-ambulance-fill'; }
    if (type === 'blood_bank') { color = '#FF6B81'; iconClass = 'ri-drop-fill'; }
    if (type === 'shelter') { color = '#2ED573'; iconClass = 'ri-home-heart-fill'; }

    return L.divIcon({
        className: 'custom-pin-container',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
                <i class="${iconClass}" style="color: white; font-size: 16px;"></i>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

export function initMap(lat, lng) {
    if (map) return; // Already initialized

    // Initialize Leaflet Map
    map = L.map('map', {
        zoomControl: false, // Hide default zoom buttons for cleaner UI
        attributionControl: false
    }).setView([lat, lng], 13);

    // Dark Mode Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    // Add User Marker (Pulse effect)
    const userIcon = L.divIcon({
        className: 'user-pin',
        html: `<div style="background-color: #3742fa; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 4px rgba(55, 66, 250, 0.4);"></div>`,
        iconSize: [16, 16]
    });

    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map)
        .bindPopup("You are here").openPopup();
}

export function clearMarkers() {
    resourceMarkers.forEach(m => map.removeLayer(m));
    resourceMarkers = [];
}

export function addResourceMarkers(resources, onMarkerClick) {
    clearMarkers();

    resources.forEach(res => {
        const marker = L.marker([res.lat, res.lng], {
            icon: createIcon(res.type)
        }).addTo(map);

        // Bind click event
        marker.on('click', () => {
            map.flyTo([res.lat, res.lng], 15, { duration: 1.5 });
            if (onMarkerClick) onMarkerClick(res.id);
        });

        resourceMarkers.push(marker);
    });
}

export function flyToLocation(lat, lng) {
    if (map) map.flyTo([lat, lng], 16, { duration: 1.5 });
}
