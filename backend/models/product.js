const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  categorie: { type: String, required: true }
});

// MongoDB génère automatiquement un champ _id
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
