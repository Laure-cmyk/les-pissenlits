

class SpecificPlant extends HTMLElement{
    static observedAttributes = ["name","latin","description"]

    connectedCallback(){
        this.render()
    }

    attributeChangedCallback(){
        this.render()
    }

    render(){

        let svg = this.getAttribute("svg")
        
        this.innerHTML = `
        <div id="plant_svg">
            
        </div>
        <div id="plant_info">
            <div id="plant_name_descr>
            <p id="plant_name">${this.getAttribute("name")}</p>
            <p id="plant_name_lat">${this.getAttribute("latin")}</p>
            <p id="description">${this.getAttribute("description")}</p>
            </div>
            <div id="plant_buttons">
                <button>Provenance</button>
                <button>Cartes</button>
                <button>Menaces</button>
            </div>
        </div>
        `
    }
}

// Déclare le tag du custom element et la classe à utiliser pour le créer dans le DOM
// Pas besoin d'exporter, juste d'être appelé une fois
customElements.define("specific-plant", SpecificPlant)