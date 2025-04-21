

export function displaySpecificPlants(plants){

    console.log(plants)
    const specificPlantSection = document.querySelector("#specific-plant");
    const plantSelector = specificPlantSection.querySelector("#plants-selector")

    plants.forEach((plant)=>{
        plantSelector.innerHTML += `<p>${plant.Name.Nom_FR}</p>`
    })

    const specificPlant = document.createElement(`specific-plant`)

    specificPlant.setAttribute("svg","/images/plant_placeholder.svg") 
    specificPlant.setAttribute("name",plants[0].Name.Nom_FR)
    specificPlant.setAttribute("latin",plants[0].Nom_scientifique)
    specificPlant.setAttribute("description",plants[0].Habitus)



    specificPlantSection.append(specificPlant)
}

