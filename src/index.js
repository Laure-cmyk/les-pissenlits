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




