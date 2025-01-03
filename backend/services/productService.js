const Product = require('../models/product');

// Récupérer tous les produits
const getAllProducts = async () => {
    const produits = await Product.find();
    return produits.map(p => ({
        id: p._id, // Transformez _id en id
        nom: p.nom,
        prix: p.prix,
        categorie: p.categorie,
    }));
};



// Récupérer un produit par ID
const getProductById = async (id) => {
    return await Product.findById(id);
};

// Créer un nouveau produit
const createProduct = async (data) => {
    const nouveauProduit = new Product(data);
    const produitSauvegarde = await nouveauProduit.save();
    return {
        id: produitSauvegarde._id,
        nom: produitSauvegarde.nom,
        prix: produitSauvegarde.prix,
        categorie: produitSauvegarde.categorie,
    };
};


// Mettre à jour un produit
const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

// Supprimer un produit
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
