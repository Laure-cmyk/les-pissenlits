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
    const datas = await loadJson("/datas/selected_neophytes.json");
    displaySpecificPlants(datas);
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

loadData();

///////////////////////

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import worldMap from "geojson-world-map";
import neophytesData from "../datas/selected_neophytes.json";
import fleurIcon from "./assets/fleur2.png";


/* Carte Suisse */
/*
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
*/

/* Carte du monde */
let worldmap = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  dragging: false,
}).setView([20, 0], 2);

const countryCoordinates = {
  Chine: { lat: 35.8617, lng: 104.1954 },
  Japon: { lat: 36.2048, lng: 138.2529 },
  Canada: { lat: 56.1304, lng: -106.3468 },
  Inde: { lat: 20.5937, lng: 78.9629 },
  Canada: { lat: 56.1304, lng: -106.3468 },
  "Afrique du Sud": { lat: -30.5595, lng: 22.9375 },
  Russie: { lat: 61.5240, lng: 105.3188 },
  "États-Unis": { lat: 37.0902, lng: -95.7129 },
};

// Add all countries
L.geoJSON(worldMap, {
  style: {
    color: "black",
    weight: 1,
    fillColor: "white",
    fillOpacity: 1,
  },
}).addTo(worldmap);

const customIcon = L.icon({
  iconUrl: fleurIcon,
  iconSize: [32, 42],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

neophytesData.forEach((plant) => {
  if (plant.Origine && countryCoordinates[plant.Origine]) {
    const coordinates = countryCoordinates[plant.Origine];
    const marker = L.marker([coordinates.lat, coordinates.lng], {
      icon: customIcon,
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

// Show the map modal (call this when you want to open the map)
function openMapModal() {
  document.querySelector("#map-modal").classList.toggle("active");
  setTimeout(() => {
    worldmap.invalidateSize(); // <-- Add this line
    window.dispatchEvent(new Event("resize")); // Fix Leaflet map display in modal
  }, 300);
}

// Hide the map modal
function closeMapModal() {
  document.getElementById("map-modal").classList.remove("active");
}

// Attach close event
document
  .getElementById("close-map-modal")
  .addEventListener("click", closeMapModal);

document.addEventListener("openMapModal", openMapModal);
