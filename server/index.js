require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const { adminDb } = require('./firebase');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'OPTIONS'], 
    allowedHeaders: ['Content-Type'], 
  })
);
app.use(express.json());

// API Routes
// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const categoriesSnapshot = await adminDb.collection('categories').get();
    const categories = [];

    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const productsSnapshot = await adminDb.collection('products').get();
    const categoriesSnapshot = await adminDb.collection('categories').get();


    const categoriesMap = {};
    categoriesSnapshot.forEach((doc) => {
      categoriesMap[doc.id] = { id: doc.id, ...doc.data() };
    });

    const products = [];
    productsSnapshot.forEach((doc) => {
      const productData = doc.data();
      const categoryId = productData.categoryId;

      products.push({
        id: doc.id,
        ...productData,
        category: categoriesMap[categoryId] || { name: 'Unknown' },
      });
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const productDoc = await adminDb
      .collection('products')
      .doc(req.params.id)
      .get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productDoc.data();
    let category = null;

    if (product.categoryId) {
      const categoryDoc = await adminDb
        .collection('categories')
        .doc(product.categoryId)
        .get();
      if (categoryDoc.exists) {
        category = {
          id: categoryDoc.id,
          ...categoryDoc.data(),
        };
      }
    }

    res.json({
      id: productDoc.id,
      ...product,
      category: category || { name: 'Unknown Category' },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.options('/create-payment-intent', cors());
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4243;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
