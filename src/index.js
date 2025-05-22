import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//https://gsap.com/docs/v3/Plugins/ScrollTrigger/?page=1#simple-example

// --- NAVIGATION DE BASE ENTRE SECTIONS
// Pinning //https://gsap.com/docs/v3/Plugins/ScrollTrigger/?page=1#simple-example
//https://codepen.io/chrisz10/pen/ExWKGzp

/*
// Timeline for #general-info section and cards
const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#introduction", // Start animation when #introduction is in view
    start: "top top", // Start when the top of #introduction hits the top of the viewport
    end: () => "+=" + document.querySelector("#general-info").offsetHeight * 3, // End after scrolling through #general-info
    scrub: 1, // Smooth scrubbing
    pin: true, // Pin the section during the animation
    markers: true, // Debug markers (remove in production)
  },
});

// Animate #general-info section appearing from bottom to top
mainTl
  .from("#general-info", {
    yPercent: 100, // Start from below the viewport
    ease: "power2.out", // Smooth easing
    duration: 1,
  })
  .from("#map", {
    yPercent: 100, // Start from below the viewport
    ease: "power2.out", // Smooth easing
    duration: 1,
  });
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
    markers: true, // Remove in production
  },
});

tlGeneralInfo
  .from(".card-1", { xPercent: -100, opacity: 0, duration: 0.5 })
  .from(".card-2", { yPercent: 100, opacity: 0, duration: 0.5 })
  .from(".card-3", { xPercent: 100, opacity: 0, duration: 0.5 })
  .from(".card-4", { yPercent: -100, opacity: 0, duration: 0.5 })
  .from(".card-5", { xPercent: -100, opacity: 0, duration: 0.5 });

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
}).addTo(map); */

let map = L.map("map", { 
    zoomControl: false, 
    scrollWheelZoom: false,
    doubleClickZoom: false,
    minZoom: 7,          // Empêcher un zoom trop éloigné
    maxZoom: 18,         // Limiter le zoom maximum
    maxBounds: [         // Limiter le déplacement à la Suisse
        [45.5, 5.5],     // Sud-Ouest
        [48.0, 11.5]     // Nord-Est
    ]
}).setView([46.822, 8.224], 8);

L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.leichte-basiskarte_reliefschattierung/default/current/3857/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.geo.admin.ch/fr/home.html">geo.admin.ch</a>'
}).addTo(map);

// Ajouter la couche des néophytes
L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.bafu.neophyten-druesiges_springkraut/default/current/3857/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.geo.admin.ch/fr/home.html">geo.admin.ch</a>',
    opacity: 0.7
}).addTo(map);


/* Code pour la worldmap */
/* let worldmap = L.map("map", { zoomControl: false, scrollWheelZoom: false }).setView([20, 0], 2);

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
            ${plant.Origine}
        `);
        
        marker.addTo(worldmap);
    }
}); */



