const closeModal = new CustomEvent("closeModal");

class MenaceModal extends HTMLElement {
  static observedAttributes = ["active", "name", "latin", "description", "svg"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <div id="menace-modal" class="modal ${
          this.getAttribute("active") ? "active" : ""
        }">
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="modal-plant">
              <div class="modal-plant-img">
                ${this.getAttribute("svg") || `<img
                  src="./public/images/plant_placeholder.svg"
                  alt="Image de la plante"
                  class="modal-plant-img"
                />`}
                
              </div>
              <div class="modal-plant-info">
                <p class="modal-plant-name">${this.getAttribute("name")}</p>
                <p class="modal-plant-latin">${this.getAttribute("latin")}</p>
                <p class="modal-plant-menace">
                  ${this.getAttribute("description")}
                </p>
                <button class="modal-btn">Ok</button>
              </div>
            </div>
          </div>
        </div>
        `;

    const modal = this.querySelector(".modal");

    this.querySelector(".close").addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.toggle("active");
    });
    this.querySelector(".modal-btn").addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.toggle("active");
    });

    this.querySelector("#menace-modal").addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target == modal) {
        modal.classList.toggle("active");
      }
    })

  }
}

// Déclare le tag du custom element et la classe à utiliser pour le créer dans le DOM
// Pas besoin d'exporter, juste d'être appelé une fois
customElements.define("menace-modal", MenaceModal);
