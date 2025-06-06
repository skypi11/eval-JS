const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

async function init() {
    const produit = await getProduct(searchParams.get("id"));
    oneProduct(produit);
}
init();

async function getProduct(id) {
    try {
        const req = await fetch(`http://localhost:3000/api/products/${id}`);
        return await req.json();
    } catch (error) {
        console.error("erreur lors de la récupération des données");
    }
}

function oneProduct(produit) {
    const ligne = produit.description.split(". ")
    const extrait = ligne.slice(0,2).join(". ")
    const template = `<article>
                <figure>
                    <img src="${produit.image}" alt="Titre de l'oeuvre" />
                </figure>
                <div>
                    <h1>${produit.titre}</h1>
                    <p>${extrait}
                    </p>
                    <div class="price">
                        <p>Acheter pour</p>
                        <span class="showprice"></span>
                    </div>
                    <div class="declinaison">
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            placeholder="1"
                            value="1"
                            min="1"
                            max="100"
                        />
                        <select name="format" id="format"></select>
                    </div>
                    <a class="button-buy" href="#">Buy ${produit.shorttitle}</a>
                </div>
            </article>

            <aside>
                <h2>Description de l'oeuvre : ${produit.titre}</h2>
                <p>${produit.description}</p>
            </aside>
  `;
    const section = document.querySelector(".detailoeuvre");
    section.insertAdjacentHTML("beforeend", template);

    const select = document.querySelector("#format");
    produit.declinaisons.forEach((element, index) => {
        const option = document.createElement("option");
        // console.log(element,index)
        option.value = index;
        option.textContent = `${element.taille}`;
        select.appendChild(option);
    });
    const quantite = document.querySelector("#quantity");
    const prix = document.querySelector(".showprice");

    function prixTotal() {
        const tailleIndex = select.value;
        const declinaison = produit.declinaisons[tailleIndex];
        let nbQuantite = parseInt(quantite.value) || 1;

        if (nbQuantite<1) {
            nbQuantite=1
        }
        if (nbQuantite>100) {
            nbQuantite=100
        }

        const total = declinaison.prix * nbQuantite;
        prix.textContent = `${total.toFixed(2)}€`;
    }

    select.addEventListener("change", prixTotal);
    quantite.addEventListener("input", prixTotal);
    prixTotal();

    const button = document.querySelector(".button-buy")
    button.addEventListener("click",(e)=>{
        e.preventDefault()
        const declinaisonIndex = document.querySelector("#format").value
        const quantite = parseInt(document.querySelector("#quantity").value) || 1

        ajoutPanier(produit, declinaisonIndex, quantite)

    })
}
function ajoutPanier(produit, declinaisonIndex, quantite) {
    let panier = JSON.parse(localStorage.getItem("panier")) || []
    const idProduit = produit._id + "-" + declinaisonIndex
    const existant = panier.find(item => item.idProduit === idProduit)
    
    if(existant){
        existant.quantite += quantite
    }else{
        panier.push({
            idProduit : idProduit,
            id : produit._id,
            image : produit.image,
            titre : produit.titre,
            format : produit.declinaisons[declinaisonIndex].taille,
            quantite : quantite
        })
    }
localStorage.setItem("panier", JSON.stringify(panier))
}
