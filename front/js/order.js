async function init() {
    const produits = await getProducts();
    afficherPanier(produits);
}
init();

async function getProducts() {
    try {
        const req = await fetch("http://localhost:3000/api/products");
        return await req.json();
    } catch (error) {
        console.error("erreur lors de la récupération des données");
    }
}

const panier = JSON.parse(localStorage.getItem("panier")) || [];
const panierArticle = document.querySelector(".panierArticle");
const totalArticle = document.querySelector(".totalArticle");

function afficherPanier(produits) {
    let total = 0;
    let quantite = 0;
    panierArticle.innerHTML = "";

    for (const article of panier) {
        const produitPanier = produits.find((p) => p._id === article.id);
        const declinaison = produitPanier.declinaisons.find(
            (d) => d.taille === article.taille
        );
        const idProduitUnique = produits.find((i)=> i.idProduit === article.idProduit)
        const prix = declinaison ? declinaison.prix : 0;
        prixQuantite = prix * article.quantite;
        total += prixQuantite;
        quantite += article.quantite;

        panierArticle.innerHTML += `
        <img src="${article.image}" alt="${article.titre}" />
                <p>${article.titre}</p>
                <p>${article.taille}</p>
                <p>${prixQuantite.toFixed(2)} €</p>
                <div>
                    <label for="quantity">Quantité : </label>
                    <input
                        type="number"
                        name="quantity"
                        id="${idProduitUnique}"
                        placeholder="1"
                        value="${article.quantite}"
                        min="1"
                        max="100"
                    />
                </div>
                <a href="#" class= boutonSupprimer>supprimer</a>
        `;
    }
    totalArticle.innerHTML = `
        <p><strong>Total de la commande : ${total.toFixed(2)} €</strong></p>
        <p>${quantite} articles pour un montant de ${total.toFixed(2)} €</p>
    `;

    // const supprArticle = document.querySelectorAll(`${idProduitUnique}`)
    function deleteArticle() {
        const boutonSppr = document.querySelectorAll(".boutonSupprimer")
        const idProduitUnique = produits.find((i)=> i.idProduit === panier.idProduit)
        const ind = 
        boutonSppr.forEach((e) => {
            e.addEventListener("click",(el)=>{
                el.preventDefault()
                localStorage.removeItem(`${idProduitUnique}`)
                console.log(idProduitUnique)
            })
        });
    }
    deleteArticle()
}

