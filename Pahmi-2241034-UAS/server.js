const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/supplier_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Category Schema & Model
const CategorySchema = new mongoose.Schema({ name: String });
const Category = mongoose.model('Category', CategorySchema);

// Product Schema & Model
const ProductSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: Number,
});
const Product = mongoose.model('Product', ProductSchema);

// Supplier Schema & Model
const SupplierSchema = new mongoose.Schema({ name: String, contact: String });
const Supplier = mongoose.model('Supplier', SupplierSchema);

// Purchase Transaction Schema & Model
const PurchaseSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  date: { type: Date, default: Date.now },
});
const Purchase = mongoose.model('Purchase', PurchaseSchema);

// CRUD Routes
app.post('/categories', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});
app.get('/categories', async (req, res) => res.send(await Category.find()));
app.put('/categories/:id', async (req, res) => {
  res.send(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete('/categories/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send(product);
});
app.get('/products', async (req, res) => res.send(await Product.find().populate('category')));
app.put('/products/:id', async (req, res) => {
  res.send(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

app.post('/suppliers', async (req, res) => {
  const supplier = new Supplier(req.body);
  await supplier.save();
  res.send(supplier);
});
app.get('/suppliers', async (req, res) => res.send(await Supplier.find()));
app.put('/suppliers/:id', async (req, res) => {
  res.send(await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete('/suppliers/:id', async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

app.post('/purchases', async (req, res) => {
  const purchase = new Purchase(req.body);
  await purchase.save();
  res.send(purchase);
});
app.get('/purchases', async (req, res) => res.send(await Purchase.find().populate('supplier').populate('product')));
app.put('/purchases/:id', async (req, res) => {
  res.send(await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete('/purchases/:id', async (req, res) => {
  await Purchase.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
