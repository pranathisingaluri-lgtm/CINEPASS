const axios = require('axios');

exports.getNearbyTheaters = async (lat, lon) => {
  // Overpass API Query to find movie theaters within 10km (10000m)
  const query = `
    [out:json];
    node["amenity"="cinema"](around:10000, ${lat}, ${lon});
    out body;
  `;
  
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
  try {
    const response = await axios.get(url);
    
    // Map OSM results to a cleaner format
    return response.data.elements.map(el => ({
      id: el.id,
      name: el.tags.name || 'Unknown Theater',
      address: el.tags['addr:full'] || el.tags['addr:street'] || 'Nearby Location',
      lat: el.lat,
      lon: el.lon,
      distance: 'Within 10km'
    })).slice(0, 5); // Return top 5
  } catch (err) {
    console.error("OSM API Error:", err);
    // Fallback theaters if API fails
    return [
      { id: 'f1', name: 'PVR Cinemas', address: 'Main Mall' },
      { id: 'f2', name: 'INOX', address: 'City Center' },
      { id: 'f3', name: 'Cinepolis', address: 'Central Square' }
    ];
  }
};
