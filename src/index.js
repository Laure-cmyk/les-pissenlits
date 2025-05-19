import { loadJson } from "@/lib/fetcher.js";
import { displaySpecificPlants } from "./modules/SpecificPlantManager";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//https://gsap.com/docs/v3/Plugins/ScrollTrigger/?page=1#simple-example

// ___ NAVIGATION DE BASE ENTRE SECTIONS ___

/*
Pinning //https://gsap.com/docs/v3/Plugins/ScrollTrigger/?page=1#simple-example
https://codepen.io/chrisz10/pen/ExWKGzp
*/

/*
  Le mieux ce serait d'avoir une seule Timeline sur un élément parent à tout le monde.
  puis de faire apparaître les différentes informations qui sont enfants au même niveau : 
  Container : (élément parent)
    Introduction (éléments enfants, même niveau)
    General Info
    Map
    ...
  puis définir le scrolltrigger sur le parent, puis définir comment arrive les enfants.
*/

const tlGeneralInfo = gsap.timeline({
  scrollTrigger: {
    trigger: "#general-info",
    start: "top top", // Start when the top of #general-info hits the center of viewport
    end: "+=300%", // Adjust this value based on how long you want the animation to last
    scrub: 1,
    pin: true,
    pin: true,
    markers: true, // Remove in production
  },
});

tlGeneralInfo
  .from(".card-1", { xPercent: -100, opacity: 0, duration: 0.5 })
  .from(".card-2", { yPercent: 100, opacity: 0, duration: 0.5 })
  .from(".card-3", { xPercent: 100, opacity: 0, duration: 0.5 })
  .from(".card-4", { yPercent: -100, opacity: 0, duration: 0.5 })
  .from(".card-5", { xPercent: -100, opacity: 0, duration: 0.5 });



/*__ SPECIFIC PLANTS __ */

async function loadData() {
  try {
    const datas = await loadJson('/datas/selected_neophytes.json');
    displaySpecificPlants(datas)
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}

loadData();


///////////////////////

import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import worldMap from 'geojson-world-map';
import neophytesData from '../datas/selected_neophytes.json';
import fleurIcon from './assets/fleur2.png';

/* Code pour la map Suisse */

/* let map = L.map("map", { zoomControl: false, scrollWheelZoom: false }).setView([46.822, 8.224], 8);

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
 */

/* Code pour la worldmap */
let worldmap = L.map("map", { zoomControl: false, scrollWheelZoom: false }).setView([20, 0], 2);

const countryCoordinates = {
    "Chine": { lat: 35.8617, lng: 104.1954 },
    "Japon": { lat: 36.2048, lng: 138.2529 },
    "Canada": { lat: 56.1304, lng: -106.3468 },
    // Ajouter d'autres pays selon vos besoins
};

// Add all countries
L.geoJSON(worldMap, {
    style: {
        color: 'black',
        weight: 1,
        fillColor: 'white',
        fillOpacity: 1
    }
}).addTo(worldmap);

const customIcon = L.icon({
  iconUrl: fleurIcon,
  iconSize: [32, 42],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

neophytesData.forEach(plant => {
    if (plant.Origine && countryCoordinates[plant.Origine]) {
        const coordinates = countryCoordinates[plant.Origine];
        const marker = L.marker([coordinates.lat, coordinates.lng], {
          icon: customIcon
        });
        
        // Add popup with plant information
        marker.bindPopup(`
            <strong>${plant.Name.Nom_FR}</strong><br>
            Nom scientifique: ${plant.Nom_scientifique}<br>
            Origine: ${plant.Origine}
        `);
        
        marker.addTo(worldmap);
    }
});



