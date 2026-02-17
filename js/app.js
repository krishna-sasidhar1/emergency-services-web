import { generateResources, calculateDistance, RESOURCE_TYPES } from './data.js';
import { initMap, addResourceMarkers, flyToLocation } from './map.js';

// State
let userLocation = { lat: 0, lng: 0 };
let allResources = [];
let currentFilter = 'all';

// DOM Elements
const landingPage = document.getElementById('landing-page');
const appView = document.getElementById('app-view');
const findHelpBtn = document.getElementById('find-help-btn');
const resourceList = document.getElementById('resource-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// --- Initialization ---

// 1. Landing Page Click
findHelpBtn.addEventListener('click', () => {
    findHelpBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Locating...';

    // Get Browser Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                startApp(latitude, longitude);
            },
            (error) => {
                alert("Location access needed to find nearby help. Defaulting to Demo Location (New York).");
                startApp(40.7128, -74.0060); // Default to NY
            }
        );
    } else {
        alert("Geolocation not supported. Defaulting to Demo Location.");
        startApp(40.7128, -74.0060);
    }
});

// 2. Start App Flow
function startApp(lat, lng) {
    userLocation = { lat, lng };

    // Switch View
    landingPage.classList.remove('active');
    landingPage.classList.add('hidden');
    appView.classList.remove('hidden');
    appView.classList.add('active');

    // Init Map
    setTimeout(() => {
        initMap(lat, lng);

        // Generate Mock Data around user
        allResources = generateResources(lat, lng);

        // Calculate Distances
        allResources = allResources.map(res => ({
            ...res,
            distance: calculateDistance(lat, lng, res.lat, res.lng)
        }));

        // Sort by distance
        allResources.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        // Initial Render
        renderresources();
    }, 500); // Delay for transition
}

// --- Core Logic ---

// Filter Handling
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // UI Update
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.closest('.filter-btn').classList.add('active');

        // Logic Update
        currentFilter = e.target.closest('.filter-btn').dataset.type;
        renderresources();
    });
});

// Render List & Map
function renderresources() {
    const listContainer = document.getElementById('resource-list');
    listContainer.innerHTML = '';

    // Filter
    const filtered = currentFilter === 'all'
        ? allResources
        : allResources.filter(r => r.type === currentFilter);

    // Update Map
    addResourceMarkers(filtered, (id) => {
        // On Marker Click -> Scroll to item in list
        const item = document.getElementById(`res-${id}`);
        if (item) {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            item.style.borderColor = 'var(--primary)';
            setTimeout(() => item.style.borderColor = 'transparent', 2000);
        }
    });

    // Update List
    if (filtered.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center; padding: 2rem; color: #666;">No resources found nearby.</div>';
        return;
    }

    filtered.forEach(res => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.id = `res-${res.id}`;
        card.innerHTML = `
            <div class="rc-header">
                <div class="rc-name">${res.name}</div>
                <div class="rc-dist">${res.distance} km</div>
            </div>
            <div class="rc-meta">
                <span><i class="ri-map-pin-line"></i> ${res.type.toUpperCase()}</span>
                <span><i class="ri-phone-line"></i> ${res.meta.phone}</span>
            </div>
            <div class="status-badge ${res.meta.status === 'Available' ? 'status-available' : 'status-critical'}">
                ${res.meta.status === 'Available' ? '● Available' : '● Critical / Full'}
            </div>
            ${res.meta.beds !== undefined ? `<span style="font-size: 0.8rem; margin-left: 10px; color: #888;">${res.meta.beds} Beds</span>` : ''}
        `;

        card.addEventListener('click', () => {
            flyToLocation(res.lat, res.lng);
        });

        listContainer.appendChild(card);
    });
}

// SOS Button
document.getElementById('sos-btn-landing').addEventListener('click', () => triggerSOS());
document.getElementById('sos-btn-app').addEventListener('click', () => triggerSOS());

function triggerSOS() {
    // Flash screen red
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.background = 'rgba(255, 0, 0, 0.5)';
    flash.style.zIndex = '9999';
    document.body.appendChild(flash);

    // Simulate Alert
    setTimeout(() => {
        alert("SOS SIGNAL SENT! \nLocation shared with nearest Rapid Response Unit.");
        flash.remove();
    }, 500);
}
