import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import worldMap from 'geojson-world-map';

let worldmap = L.map("worldmap", { zoomControl: false, scrollWheelZoom: false }).setView([20, 0], 2);


// Create a white background
L.rectangle([[-90, -180], [90, 180]], {
    color: 'white',
    fillColor: '#EDDDC8',
    fillOpacity: 1
}).addTo(worldmap);

// Add all countries
L.geoJSON(worldMap, {
    style: {
        color: 'black',
        weight: 1,
        fillColor: 'white',
        fillOpacity: 1
    }
}).addTo(worldmap);