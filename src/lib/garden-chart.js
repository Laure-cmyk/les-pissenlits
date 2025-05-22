import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import data from "/datas/selected_neophytes.json" assert { type: "json" };
import { loadSvg } from "@/lib/fetcher.js";

// --- Configuration ---
const config = {
  plantSpacing: 400,
  minSizeMeters: 0.2,
  maxSizeMeters: 25,
  animationDuration: 300,
  growDelay: 100, // Temps avant qu'une nouvelle plante ne s'affiche (en ms)
  groundHeight: 70, //Hauteur de la bande d'herbe
  maxVisiblePlants: 8, // Nombre maximum de plantes visibles à l'écran
  autoGrowInterval: 300, // Intervalle entre chaque nouvelle plante (en ms)
};

let currentActivePlants = 0;
let isChartVisible = false;
let animatedPlants = new Set(); // Ensemble pour suivre les plantes déjà animées

// --- Préparation des données ---
data.forEach((d) => {
  if (d.Taille_min != null) d.Taille_min /= 100;
  if (d.Taille_max != null) d.Taille_max /= 100;
});
data.sort((a, b) => (b.Taille_max ?? 0) - (a.Taille_max ?? 0));

console.log(data);

const nbNeophytes = document.querySelector("#plant-count");
nbNeophytes.innerHTML = `Nombre de néophytes : ${data.length}`;

// --- Dimensions ---
function getDimensions() {
  return {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  };
}
let { screenWidth, screenHeight } = getDimensions();

// --- Sélection du conteneur et création du SVG ---
const chartContainer = d3
  .select("#chart")
  .style("width", "100%")
  .style("height", "100vh")
  .style("position", "relative")
  .style("overflow-x", "auto")
  .style("overflow-y", "hidden");

const svg = chartContainer
  .append("svg")
  .attr("width", screenWidth)
  .attr("height", screenHeight)
  .style("display", "block");

// --- Dégradé ciel ---
const defs = svg.append("defs");
const gradient = defs
  .append("linearGradient")
  .attr("id", "sky-gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");
gradient.append("stop").attr("offset", "0%").attr("stop-color", "#cceeff");
gradient.append("stop").attr("offset", "100%").attr("stop-color", "#eaffea");

svg
  .append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "url(#sky-gradient)")
  .lower();

// --- Bande d'herbe ---
svg
  .append("rect")
  .attr("y", screenHeight - config.groundHeight)
  .attr("width", "100%")
  .attr("height", config.groundHeight)
  .attr("fill", "green")
  .attr("opacity", 0.6);

// --- Groupe nuages ---
const clouds = svg.append("g").attr("id", "clouds");
for (let i = 0; i < 5; i++) {
  clouds
    .append("ellipse")
    .attr("cx", Math.random() * screenWidth)
    .attr("cy", Math.random() * (screenHeight * 0.3))
    .attr("rx", 40 + Math.random() * 30)
    .attr("ry", 20 + Math.random() * 10)
    .attr("fill", "white")
    .attr("opacity", 0.7);
}

// --- Groupe plantes ---
const container = svg.append("g");

// --- Fonctions utilitaires ---
function getColor(habitus) {
  const colors = {
    Arbre: "#006400",
    Buisson: "#8B008B",
    Herbacée: "#32CD32",
    "Plante aquatique": "#008080",
    Liane: "#FF8C00",
    Graminéen: "#DAA520",
    Succulent: "#FFB6C1",
  };
  return colors[habitus] || "#808080";
}

const berceSvg = await loadSvg("/images/plants/Berce_du_Caucase.svg");
const buddlejaSvg = await loadSvg("/images/plants/Buddleja_davidii_Franch.svg");
const vergeretteSvg = await loadSvg("/images/plants/Vergerette_annuelle.svg");
const placeholderSvg = await loadSvg("/images/plant_placeholder.svg");

// Fonction pour créer une fleur SVG
function createFlower(plantName) {
  let plantSvg = null;

  switch(plantName) {
    case "Heracleum mantegazzianum Sommier & Levier":
      plantSvg = berceSvg;
      break;
    case "Buddleja davidii Franch.":
      plantSvg = buddlejaSvg;
      break;
    case "Erigeron annuus (L.) Desf.":
      plantSvg = vergeretteSvg;
      break;
    default:
      plantSvg = placeholderSvg;
      break;
  }

  // Si le SVG n'est pas trouvé, renvoie une fleur par défaut
  return plantSvg || "<g></g>";

  /*
  return `
    <g class="flower">
      <!-- Tige -->
      <line x1="0" y1="0" x2="0" y2="-100" stroke="${color}" stroke-width="4"/>
      <!-- Pétales -->
      <circle cx="0" cy="-100" r="15" fill="${color}" opacity="0.8"/>
      <circle cx="-15" cy="-85" r="10" fill="${color}" opacity="0.8"/>
      <circle cx="15" cy="-85" r="10" fill="${color}" opacity="0.8"/>
      <circle cx="-15" cy="-115" r="10" fill="${color}" opacity="0.8"/>
      <circle cx="15" cy="-115" r="10" fill="${color}" opacity="0.8"/>
      <!-- Centre de la fleur -->
      <circle cx="0" cy="-100" r="8" fill="yellow"/>
    </g>
  `;
  */
}

function getSizeScale() {
  // Calcule la hauteur maximale disponible en pixels (75% de la hauteur de l'écran)
  const pixelAvailable = screenHeight * 0.75;

  // Crée une échelle linéaire de D3.js
  return (
    d3
      .scaleLinear()
      // Domaine : taille réelle des plantes en mètres (0.2m à 25m)
      .domain([config.minSizeMeters, config.maxSizeMeters])
      // Plage : taille en pixels (10px à pixelAvailable)
      .range([10, pixelAvailable])
      // Empêche les valeurs de sortir de la plage définie
      .clamp(true)
  );
}

function getPlantHeight(plant) {
  // Récupère l'échelle de taille
  const scale = getSizeScale();

  // Convertit la taille maximale de la plante en pixels
  // Si Taille_max n'existe pas, utilise 1 comme valeur par défaut
  // Garantit une hauteur minimale de 10 pixels
  return Math.max(scale(plant.Taille_max ?? 1), 10);
}

// --- Fonction pour calculer les positions des plantes ---
function calculatePlantPositions() {
  const positions = [];
  const visibleWidth = screenWidth;
  const totalWidth = Math.max(
    visibleWidth,
    (data.length - 1) * config.plantSpacing + 120
  );

  data.slice(0, currentActivePlants).forEach((d, i) => {
    const x = 60 + i * config.plantSpacing;
    const y = 0; //screenHeight - config.groundHeight - 10;
    positions.push({ plant: d, x, y, height: getPlantHeight(d) });
  });

  // Mettre à jour la largeur du conteneur SVG pour permettre le défilement
  svg.attr("width", totalWidth);
  container.attr("transform", `translate(0, 0)`);

  return positions;
}

// --- Fonction pour mettre à jour le jardin ---
function updateGarden() {
  const positions = calculatePlantPositions();

  const plants = container
    .selectAll("g.plant")
    .data(positions, (d) => d.plant.taxon_id);

  const enter = plants
    .enter()
    .append("g")
    .attr("class", "plant")
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

  enter.each(function (d, i) {
    const flower = createFlower(d.plant.Nom_scientifique);
    const g = d3.select(this);

    g.html(flower);
    g.select("g.flower")
      .attr("transform-origin", "0 0")
      .attr("transform", "scale(0)")
      .transition()
      .delay(i * config.growDelay)
      .duration(config.animationDuration)
      .attr("transform", `scale(${d.height / 100})`);

    g.append("text")
      .attr("y", screenHeight - config.groundHeight)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text(`${d.plant.Taille_max ?? 1}m`);

    animatedPlants.add(d.plant.taxon_id);
  });

  plants.exit().remove();
}

// --- Oscillation plantes et déplacement nuages ---
d3.timer((elapsed) => {
  const positions = calculatePlantPositions();
  container.selectAll("g.plant").each(function (d, i) {
    if (i >= positions.length) return;
    const pos = positions[i];
    const size = pos.height;
    const speedFactor = 3000 - size * 5;
    const x = pos.x;
    const y = pos.y + Math.sin(elapsed / speedFactor + i) * 2;
    d3.select(this).attr("transform", `translate(${x}, ${y})`);
  });

  clouds.selectAll("ellipse").each(function () {
    const cloud = d3.select(this);
    const currentX = parseFloat(cloud.attr("cx"));
    cloud.attr("cx", ((currentX + 0.05) % (screenWidth + 100)) - 50);
  });
});

// --- Gestion redimensionnement fenêtre ---
window.addEventListener("resize", () => {
  const newDimensions = getDimensions();
  screenWidth = newDimensions.screenWidth;
  screenHeight = newDimensions.screenHeight;

  svg.attr("width", screenWidth).attr("height", screenHeight);

  svg
    .select("rect:first-child")
    .attr("width", screenWidth)
    .attr("height", screenHeight);

  svg
    .select("rect:last-of-type")
    .attr("y", screenHeight - config.groundHeight)
    .attr("width", screenWidth);

  updateGarden();
});

// --- Fonction pour la croissance automatique ---
function startAutoGrowth() {
  if (!isChartVisible) return;

  const interval = setInterval(() => {
    if (currentActivePlants < data.length && isChartVisible) {
      currentActivePlants++;
      updateGarden();
    } else {
      clearInterval(interval);
    }
  }, config.autoGrowInterval);
}

// --- Configuration de l'observateur d'intersection ---
function setupIntersectionObserver() {
  const chartSection = document.getElementById("chart");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        //Vérifier que ce n'est pas dans le set
        if (entry.isIntersecting) {
          isChartVisible = true;
          startAutoGrowth();
        } else {
          isChartVisible = false;
        }
      });
    },
    {
      threshold: 0.5, // Déclenche quand 50% de la section est visible
    }
  );

  observer.observe(chartSection);
}

// --- Gestion du défilement horizontal ---
function setupHorizontalScroll() {
  const chartSection = document.getElementById("chart");
  chartSection.style.overflowX = "auto";
  chartSection.style.overflowY = "hidden";
  chartSection.style.whiteSpace = "nowrap";
}

// --- Initialisation ---
//updateGarden();
setupHorizontalScroll();
setupIntersectionObserver();
