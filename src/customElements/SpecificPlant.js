const menaceClick = new CustomEvent("menaceClick");
const provenanceClick = new CustomEvent("provenanceClick");
const carteClick = new CustomEvent("carteClick");

class SpecificPlant extends HTMLElement {
  static observedAttributes = ["name", "latin", "description"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <div id="plant-svg">
            ${this.getAttribute("svg")}
        </div>
        <div id="plant-info">
            <div id="plant-name_descr>
            <p id="plant-name">${this.getAttribute("name")}</p>
            <p id="plant-name-lat">${this.getAttribute("latin")}</p>
            <p id="description">${this.getAttribute("description")}</p>
            </div>
            <div id="plant-buttons">
                <button>Provenance</button>
                <button>Cartes</button>
                <button class="menaces-btn">Menaces</button>
            </div>
        </div>
        `;
        this.querySelector('.menaces-btn').addEventListener('click', (e) => {
          e.preventDefault()
          this.dispatchEvent(menaceClick)
        })
  }
}

// Déclare le tag du custom element et la classe à utiliser pour le créer dans le DOM
// Pas besoin d'exporter, juste d'être appelé une fois
customElements.define("specific-plant", SpecificPlant);
