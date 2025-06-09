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
    const ligne = produit.description.split(". ");
    const extrait = ligne.slice(0, 2).join(". ");
    const template = `<article>
                            <figure>
                                <img src="${produit.image}" alt="${produit.titre}" />
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
                                        <button class="button-buy">Buy ${produit.shorttitle}</button>
                                        <div id="ajoutPanier">
                                            Produit ajouté au panier !
                                        </div>
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
    produit.declinaisons.forEach((element) => {
        const option = document.createElement("option");
        // console.log(element,index)
        option.value = element.taille;
        option.textContent = element.taille;
        select.appendChild(option);
    });
    const quantite = document.querySelector("#quantity");
    const prix = document.querySelector(".showprice");

    function prixTotal() {
        const tailleChoisie = select.value;
        const declinaison = produit.declinaisons.find(
            (d) => d.taille === tailleChoisie
        );
        let nbQuantite = parseInt(quantite.value) || 1;

        if (nbQuantite < 1) {
            nbQuantite = 1;
        }
        if (nbQuantite > 100) {
            nbQuantite = 100;
        }

        const total = declinaison.prix * nbQuantite;
        prix.textContent = `${total.toFixed(2)}€`;
    }

    const button = document.querySelector(".button-buy");
    function checkQuantite() {
        let nbQuantite = parseInt(quantite.value) || 1;
        const valide = nbQuantite >= 1 && nbQuantite <= 100;
        button.disabled = !valide;
        if (!valide) {
            prix.innerHTML = `<span style="color: red;">La quantité doit etre comprise <br> entre 1 et 100</span>`;
        } else {
            prixTotal();
        }
    }
    select.addEventListener("change", prixTotal);
    //quantite.addEventListener("input", prixTotal);
    quantite.addEventListener("input", checkQuantite);
    //prixTotal();
    checkQuantite();

    button.addEventListener("click", (e) => {
        e.preventDefault();
        if (button.disabled) {
            return;
        }
        const tailleChoisie = select.value;
        const quantite =
            parseInt(document.querySelector("#quantity").value) || 1;

        ajoutPanier(produit, tailleChoisie, quantite);
        confirmAjoutPanier();
    });
}
function confirmAjoutPanier() {
    const toast = document.getElementById("ajoutPanier");
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000); // 2 secondes
}
function ajoutPanier(produit, tailleChoisie, quantite) {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    const declinaison = produit.declinaisons.find(
        (d) => d.taille === tailleChoisie
    );
    const idProduit = produit._id + "-" + declinaison.taille;
    const existant = panier.find((item) => item.idProduit === idProduit);
    if (existant) {
        existant.quantite += quantite;
    } else {
        panier.push({
            idProduit: idProduit,
            id: produit._id,
            image: produit.image,
            titre: produit.titre,
            taille: declinaison.taille,
            quantite: quantite,
        });
    }
    localStorage.setItem("panier", JSON.stringify(panier));
}
