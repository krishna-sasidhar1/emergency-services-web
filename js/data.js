/**
 * Emergency Resource Data Generator
 * Creates realistic mock data around the user's location.
 */

const NAMES = {
    hospital: ["City General Hospital", "Emergency Care Center", "St. Mary's Medical", "Hope Valley Clinic", "Trauma Center North"],
    ambulance: ["Rapid Response Unit #42", "City EMS", "LifeSave Ambulance", "ParaMed Unit 09"],
    blood_bank: ["Red Cross Center", "City Blood Bank", "LifeStream Donation"],
    shelter: ["Community Safe House", "Downtown Relief Center", "St. John's Shelter"]
};

// Types corresponding to filters
export const RESOURCE_TYPES = {
    HOSPITAL: 'hospital',
    AMBULANCE: 'ambulance',
    BLOOD: 'blood_bank',
    SHELTER: 'shelter'
};

// Helper to get random item from array
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random coordinates within ~5km radius
const randomGeo = (centerLat, centerLng) => {
    const r = 0.04; // Roughly 4-5km
    const y0 = centerLat;
    const x0 = centerLng;
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y1 = w * Math.sin(t);
    const x1 = x / Math.cos(y0);
    return { lat: y0 + y1, lng: x0 + x1 };
};

export function generateResources(centerLat, centerLng) {
    const resources = [];
    const count = 15; // Generate 15 fake resources

    for (let i = 0; i < count; i++) {
        const typeKey = rand(Object.keys(NAMES));
        const name = rand(NAMES[typeKey]);
        const coords = randomGeo(centerLat, centerLng);
        
        // Random Availability
        const beds = Math.floor(Math.random() * 20);
        const status = beds > 3 ? 'Available' : 'Critical';

        resources.push({
            id: i,
            name: `${name} ${Math.floor(Math.random() * 100)}`,
            type: typeKey,
            lat: coords.lat,
            lng: coords.lng,
            distance: 0, // Calculated later
            meta: {
                beds: beds,
                phone: `+1 555-01${Math.floor(Math.random() * 99)}`,
                status: status
            }
        });
    }

    return resources;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
