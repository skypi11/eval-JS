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
    const sizes = produit.declinaisons;
    for (const size of sizes) {
        taile = size.taille;
    }

    console.log(taile);

    const template = `<article>
                <figure>
                    <img src="${produit.image}" alt="Titre de l'oeuvre" />
                </figure>
                <div>
                    <h1>${produit.titre}</h1>
                    <p>${produit.description}
                    </p>
                    <div class="price">
                        <p>Acheter pour</p>
                        <span class="showprice">35.25€</span>
                    </div>
                    <div class="declinaison">
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            placeholder="1"
                            value="1"
                            minlength="1"
                        />
                        <select name="format" id="format">
                        <option value=""></option>
                            
                        </select>
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
}

