const productService = require('../services/productService');

// Récupérer tous les produits
const getProducts = async (req, res) => {
    try {
        const produits = await productService.getAllProducts();
        res.json(produits);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
};

// Récupérer un produit par ID
const getProduct = async (req, res) => {
    try {
        const produit = await productService.getProductById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
    }
};

// Créer un produit
const createProduct = async (req, res) => {
    try {
        const nouveauProduit = await productService.createProduct(req.body);
        res.status(201).json(nouveauProduit);
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de la création du produit' });
    }
};

// Mettre à jour un produit
const updateProduct = async (req, res) => {
    try {
        const produit = await productService.updateProduct(req.params.id, req.body);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du produit' });
    }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
    try {
        const produit = await productService.deleteProduct(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
