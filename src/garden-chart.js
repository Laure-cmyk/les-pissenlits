import * as d3 from "d3";

import data from "../datas/selected_neophytes.json" assert { type: "json" };

const width = window.innerWidth;
const height = window.innerHeight;

// Sélectionne ton conteneur
const svg = d3
  .select("#chart") // ou #map selon ton HTML
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#eaffea");

const container = svg.append("g");

// Zoom
const zoom = d3
  .zoom()
  .scaleExtent([0.5, 10])
  .on("zoom", (event) => {
    container.attr("transform", event.transform);
  });

svg.call(zoom);


// ➡️ Affiche nombre de néophytes dans la page
d3.select("body")
  .append("div")
  .attr("id", "plant-count")
  .style("position", "fixed")
  .style("top", "20px")
  .style("left", "20px")
  .style("background", "white")
  .style("padding", "8px 12px")
  .style("border-radius", "8px")
  .style("box-shadow", "0 2px 6px rgba(0,0,0,0.15)")
  .style("font-size", "16px")
  .text(`Nombre de néophytes : ${data.length}`);

const plants = container
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d, i) => (i + 1) * (width / (data.length + 1)))
  .attr("cy", height / 2)
  .attr("r", 0) // Rayon initial 0
  .attr("fill", "limegreen")
  .attr("opacity", 0.8);

window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollProgress = Math.min(window.scrollY / maxScroll, 1);

  updateGarden(scrollProgress, plants, data);
});

updateGarden(0, plants, data);

// Fonction pour animer l'apparition
function updateGarden(progress, plants, data) {
  const totalPlants = data.length;
  const activePlants = Math.floor(progress * totalPlants);

  plants.attr("r", (d, i) => {
    if (i <= activePlants) {
      return progress ** 1.5 * 50; // taille dynamique
    }
    return 0;
  });
}
