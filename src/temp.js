import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import worldMap from 'geojson-world-map';

let map = L.map("map", { zoomControl: false, scrollWheelZoom: false }).setView([46.822, 8.224], 8);

// Add the base tile layer
/* L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  minZoom: 8,
  maxZoom: 8,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map); */

const switzerlandGeoJSON = worldMap.features.find(feature => feature.properties.name === 'Switzerland');

// Create a white background
L.rectangle([[-90, -180], [90, 180]], {
    color: 'white',
    fillColor: '#EDDDC8',
    fillOpacity: 1
}).addTo(map);

// Add Switzerland's outline
L.geoJSON(switzerlandGeoJSON, {
    style: {
        color: 'black',
        weight: 2,
        fillColor: 'white',
        fillOpacity: 1
    }
}).addTo(map);