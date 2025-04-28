const closeModal = new CustomEvent("closeModal");

class MenaceModal extends HTMLElement {
  static observedAttributes = ["active", "name", "latin", "description"];

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
                <img
                  src="./public/images/plant_placeholder.svg"
                  alt="Image de la plante"
                  class="modal-plant-img"
                />
              </div>
              <div class="modal-plant-info">
                <p class="modal-plant-name">Saucisse</p>
                <p class="modal-plant-latin">Saucissus Maximus</p>
                <p class="modal-plant-menace">
                  Saucissum dolor amet, merguez tempor incididunt boudin aliqua.
                  Chorizo elit, sed do eiusmod bratwurst ut labore et dolore
                  magna aliqua. Ut enim ad minim saucisson, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex salami
                  consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse kielbasa dolore eu fugiat nulla pariatur. Excepteur
                  sint cillum dolore charcuterie. Non proident, culpa qui
                  officia bresaola mollit anim id est laborum. Lorem saucisse
                  ipsum dolor sit amet, andouille consectetur knackwurst
                  adipiscing elit. Fusce mortadella ligula, accumsan non
                  chipolata ac, dictum nec jambon. Integer viverra knackis
                  lacus, at rhoncus saucisson sec vel condimentum.
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
