import { loadSvg } from "@/lib/fetcher.js";

export async function displaySpecificPlants(plants) {
  console.log(plants);

  const specificPlantSection = document.querySelector("#specific-plant");

  const specificPlant = document.createElement(`specific-plant`);

  const menaceModal = document.createElement(`menace-modal`);
  const provenanceMap = document.querySelector("#map");
  
  console.log(provenanceMap);
  const carteModal = document.querySelector("#swiss-map")

  let svg = null;
  svg = "<img src='images/plants/" + plants[0].img + "'>";

  specificPlant.setAttribute("svg", svg);
  specificPlant.setAttribute("name", plants[0].Name.Nom_FR);
  specificPlant.setAttribute("latin", plants[0].Nom_scientifique);
  specificPlant.setAttribute("habitus", plants[0].Habitus);
  specificPlant.setAttribute("description", plants[0].Description);
  specificPlant.setAttribute("plants", JSON.stringify(plants));

  specificPlant.addEventListener("menaceClick", () => {
    console.log("open modal");
    menaceModal.setAttribute("active", true);
    menaceModal.setAttribute("name", specificPlant.getAttribute("name"));
    menaceModal.setAttribute("latin", specificPlant.getAttribute("latin"));
    menaceModal.setAttribute(
      "description",
      specificPlant.getAttribute("description")
    );

    const tempSvg = document.querySelector("#plant-svg img");
    menaceModal.setAttribute("svg", tempSvg ? tempSvg.outerHTML : "");
  });

specificPlant.addEventListener("carteClick", () => {
  document.dispatchEvent(new CustomEvent("openMapModal", {
    detail: { mapType: 'swiss' }
  }));
});

specificPlant.addEventListener("provenanceClick", () => {
  document.dispatchEvent(new CustomEvent("openMapModal", {
    detail: { mapType: 'world' }
  }));
});

/*   specificPlant.addEventListener("carteClick", () => {
    console.log("open carte");
    document.dispatchEvent(new CustomEvent("openMapModal"));
  });

  specificPlant.addEventListener("provenanceClick", () => {
    console.log("open provenance");
    document.dispatchEvent(new CustomEvent("openMapModal"));
    //provenanceMap.classList.toggle("active");
  }); */

  specificPlantSection.append(specificPlant);

  specificPlantSection.append(menaceModal);

  /*
  const plantSelector = specificPlantSection.querySelector("#plants-list");

  plants.forEach((plant) => {
    const plantItem = document.createElement("li");
    plantItem.classList.add("plant-item");

    plantItem.dataset.description = plant.Habitus;
    plantItem.dataset.name = plant.Name.Nom_FR;
    plantItem.dataset.nameLatin = plant.Nom_scientifique;

    plantItem.innerText = plant.Name.Nom_FR;

    plantItem.addEventListener("click", () => {
      const plantItems = document.querySelectorAll(".plant-item");

      plantItems.forEach((i) => i.classList.remove("active"));

      specificPlant.setAttribute("name", plantItem.dataset.name);
      specificPlant.setAttribute("latin", plantItem.dataset.nameLatin);
      specificPlant.setAttribute("description", plantItem.dataset.description);

      plantItem.classList.toggle("active");
    });

    plantSelector.append(plantItem);
  });
  */

  // /* Gestion du scroll de la liste */
  // const scrollContent = document.querySelector("#plants-list"); // Conteneur avec overflow-y
  // const upButton = document.querySelector(".scroll-btn.up");
  // const downButton = document.querySelector(".scroll-btn.down");
  // const scrollStep = 50; // Nombre de pixels à défiler par clic

  // // Défilement vers le haut
  // upButton.addEventListener("click", () => {
  //   scrollContent.scrollBy({
  //     top: -scrollStep, // Défile vers le haut
  //     behavior: "smooth", // Défilement fluide
  //   });
  // });

  // // Défilement vers le bas
  // downButton.addEventListener("click", () => {
  //   scrollContent.scrollBy({
  //     top: scrollStep, // Défile vers le bas
  //     behavior: "smooth", // Défilement fluide
  //   });
  // });
}
