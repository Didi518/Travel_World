import Product from '../models/Product.js';
import User from '../models/User.js';

// obtenir les articles en ligne

export const getProducts = async (req, res) => {
  try {
    const sort = { _id: -1 };
    const products = await Product.find().sort(sort);
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// créer un nouveau produit

export const newProduct = async (req, res) => {
  try {
    const { name, description, price, category, images: pictures } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      pictures,
    });
    const products = await Product.find();
    res.status(201).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// éditer un produit

export const editProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, price, category, pictures } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      name,
      description,
      price,
      category,
      pictures
    );
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// suppression d'un produit

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user.isAdmin) return res.status(401).json('Action interdite');
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// récupérer un produit par son id ou sa catégorie

export const findProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// trier les produits par catégorie

export const productsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    let products;
    if (category === 'tout') {
      products = await Product.find().sort([['date', -1]]);
    } else {
      products = await Product.find({ category });
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export default {
  getProducts,
  newProduct,
  editProduct,
  deleteProduct,
  findProduct,
  productsByCategory,
};
