async function init() {
    const produits = await getProducts();
    allProducts(produits);
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
function allProducts(produits) {
    for (const produit of produits) {
        const template = `<article>
                <img src="${produit.image}" alt="Titre produit">
                <a href="product.html/?${produit._id}">Buy ${produit.shorttitle}</a>
            </article>
    `;
        const section = document.querySelector(".products");
        section.insertAdjacentHTML("beforeend", template);
    }
}
