import * as d3 from "d3";
import data from "../datas/selected_neophytes.json" assert { type: "json" };

// --- Dimensions de l'écran ---
const width = window.innerWidth;
const height = window.innerHeight;

// --- Trier les plantes du plus grand au plus petit selon Taille_max ---
data.sort((a, b) => (b.Taille_max ?? 0) - (a.Taille_max ?? 0));

// --- Créer le SVG principal ---
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#eaffea");

// --- Groupe conteneur ---
const container = svg.append("g");

// --- Variables de contrôle ---
let currentActivePlants = 1;
let lastScrollTime = 0;
const scrollCooldown = 300; // 300ms entre deux scrolls

// --- Afficher le compteur de néophytes ---
d3.select("body")
  .append("div")
  .attr("id", "plant-count")
  .text(`Nombre de néophytes : ${data.length}`);

// --- Fonction pour mettre à jour l'affichage du jardin ---
function updateGarden() {
  container
    .selectAll("g.plant")
    .data(data.slice(0, currentActivePlants), (d) => d.taxon_id)
    .join(
      // --- Nouvelle plante ---
      (enter) => {
        const g = enter
          .append("g")
          .attr("class", "plant")
          .attr("transform", (d, i) => getPlantPosition(i));

        g.append("circle")
          .attr("r", 0)
          .attr("fill", (d) => getColor(d.Habitus))
          .attr("opacity", 0.8)
          .transition()
          .duration(1000)
          .attr("r", (d) => Math.sqrt(d.Taille_max ?? 100));

        g.append("text")
          .text((d) => d.Name.Nom_FR)
          .attr("text-anchor", "middle")
          .attr("dy", "-1.5em")
          .style("font-size", "12px")
          .style("fill", "#333")
          .style("opacity", 0)
          .transition()
          .duration(800)
          .style("opacity", 1);

        return g;
      },
      // --- Mise à jour des positions ---
      (update) =>
        update
          .transition()
          .duration(500)
          .attr("transform", (d, i) => getPlantPosition(i)),
      // --- Suppression ---
      (exit) => exit.transition().duration(500).attr("opacity", 0).remove()
    );
}

// --- Fonction pour calculer la position ---
// La dernière plante ajoutée est tout à gauche (x=50)
// Les suivantes se décalent vers la droite ➡️
function getPlantPosition(i) {
  const spacing = 100; // Espace fixe entre chaque plante
  const total = currentActivePlants;
  const x = 50 + (total - i - 1) * spacing; // inversé pour pousser à droite
  const y = height - 50; // Aligné en bas
  return `translate(${x}, ${y})`;
}

// --- Détecter si on est dans la section #chart ---
function isInChartSection() {
  const chart = document.querySelector("#chart");
  const rect = chart.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

// --- Gestion du scroll ---
window.addEventListener(
  "wheel",
  (event) => {
    const now = Date.now();
    if (now - lastScrollTime < scrollCooldown) return;
    lastScrollTime = now;

    if (isInChartSection()) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        // ➡️ Uniquement si scroll horizontal
        event.preventDefault();

        const totalPlants = data.length;

        if (event.deltaX > 0) {
          // ➡️ Scroll vers la droite ➔ Ajouter une plante
          if (currentActivePlants < totalPlants) {
            currentActivePlants++;
            updateGarden();
          }
        } else if (event.deltaX < 0) {
          // ⬅️ Scroll vers la gauche ➔ Retirer une plante
          if (currentActivePlants > 1) {
            currentActivePlants--;
            updateGarden();
          }
        }
      }
    }
  },
  { passive: false }
); // Autoriser preventDefault()

// --- Animation flottement doux des plantes ---
d3.timer((elapsed) => {
  container.selectAll("g.plant").attr("transform", (d, i) => {
    const spacing = 100;
    const total = currentActivePlants;
    const x = 50 + (total - i - 1) * spacing; // inversé pour animer aussi
    const y = height - 50 + Math.sin(elapsed / 1000 + i) * 5;
    return `translate(${x}, ${y})`;
  });
});

// --- Couleur selon type de plante ---
function getColor(habitus) {
  switch (habitus) {
    case "Arbre":
      return "darkgreen";
    case "Buisson":
      return "purple";
    case "Herbacée":
      return "limegreen";
    case "Plante aquatique":
      return "teal";
    case "Liane":
      return "orange";
    case "Graminéen":
      return "gold";
    case "Succulent":
      return "lightpink";
    default:
      return "gray";
  }
}

// --- Lancer une première fois ---
updateGarden();