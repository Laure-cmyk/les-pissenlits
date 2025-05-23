const menaceClick = new CustomEvent("menaceClick");
const provenanceClick = new CustomEvent("provenanceClick");
const carteClick = new CustomEvent("carteClick");

class SpecificPlant extends HTMLElement {
  static observedAttributes = ["name", "latin", "description", "plants"];

  plants = [];

  connectedCallback() {
    this.render();
    this.plants = JSON.parse(this.getAttribute("plants"));

    this.setupList();
    this.setupButtons();
  }

  attributeChangedCallback() {
    // Get scroll position if the list exists
    let scrollTop = 0;
    const plantSelector = this.querySelector("#plants-list");
    if (plantSelector) {
      scrollTop = plantSelector.scrollTop;
    }
    this.render();
    this.setupList(scrollTop);
    this.setupButtons();
  }

  setupList(savedScrollTop) {
    const plantSelector = this.querySelector("#plants-list");

    if (!plantSelector) return;

    plantSelector.innerHTML = "";
    this.plants.forEach((plant) => {
      const plantItem = document.createElement("li");
      plantItem.classList.add("plant-item");
      plantItem.dataset.description = plant.Habitus;
      plantItem.dataset.name = plant.Name.Nom_FR;
      plantItem.dataset.nameLatin = plant.Nom_scientifique;
      plantItem.innerText = plant.Name.Nom_FR;
      plantItem.addEventListener("click", () => {
        const plantItems = this.querySelectorAll(".plant-item");
        plantItems.forEach((i) => i.classList.remove("active"));
        this.setAttribute("name", plantItem.dataset.name);
        this.setAttribute("latin", plantItem.dataset.nameLatin);
        this.setAttribute("description", plantItem.dataset.description);
        plantItem.classList.add("active");
      });
      // Highlight the active item
      if (
        plant.Name.Nom_FR === this.getAttribute("name") &&
        plant.Nom_scientifique === this.getAttribute("latin")
      ) {
        plantItem.classList.add("active");
      }
      plantSelector.append(plantItem);
    });

    // Restore scroll position AFTER rebuilding
    plantSelector.scrollTop = savedScrollTop;

    // Scroll buttons
    const scrollContent = this.querySelector("#plants-list");
    const upButton = this.querySelector(".scroll-btn.up");
    const downButton = this.querySelector(".scroll-btn.down");
    const scrollStep = 50;
    if (upButton && scrollContent) {
      upButton.onclick = () => {
        scrollContent.scrollBy({ top: -scrollStep, behavior: "smooth" });
      };
    }
    if (downButton && scrollContent) {
      downButton.onclick = () => {
        scrollContent.scrollBy({ top: scrollStep, behavior: "smooth" });
      };
    }
  }

  setupButtons() {
    const menacesBtn = this.querySelector(".menaces-btn");
    const cartesBtn = this.querySelector(".cartes-btn");
    const provenanceBtn = this.querySelector(".provenance-btn");
    if (menacesBtn) {
      menacesBtn.onclick = (e) => {
        e.preventDefault();
        this.dispatchEvent(menaceClick);
      };
    }
    if (cartesBtn) {
      cartesBtn.onclick = (e) => {
        e.preventDefault();
        this.dispatchEvent(carteClick);
      };
    }
    if (provenanceBtn) {
      provenanceBtn.onclick = (e) => {
        e.preventDefault();
        this.dispatchEvent(provenanceClick);
      };
    }
  }

  render() {
    this.innerHTML = `
        <div id="plants-selector">
          <button class="scroll-btn up">▲</button>
          <ul id="plants-list"></ul>
          <button class="scroll-btn down">▼</button>
        </div>
        <div id="plant-svg">
            ${this.getAttribute("svg")}
        </div>
        <div id="plant-info">
            <div id="plant-name-descr">
              <p id="plant-name">${this.getAttribute("name")}</p>
              <p id="plant-name-lat">${this.getAttribute("latin")}</p>
              <p id="description">${this.getAttribute("description")}</p>
            </div>
            <div id="plant-buttons">
                <button class="provenance-btn">Provenance</button>
                <button class="cartes-btn">Cartes</button>
                <button class="menaces-btn">Menaces</button>
            </div>
        </div>
        `;
  }
}

customElements.define("specific-plant", SpecificPlant);
