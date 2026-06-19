const Product = require('../models/Product');

// @desc    Get all products (with filters & search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, gender, sort } = req.query;

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      let filteredProducts = [...global.mockProducts];

      // Category filter
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }

      // Gender filter
      if (gender && gender !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.gender === gender);
      }

      // Search query filter
      if (search) {
        const query = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );
      }

      // Sorting
      if (sort === 'Price Low to High') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sort === 'Price High to Low') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sort === 'Discount') {
        filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      } else if (sort === 'Popular') {
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json(filteredProducts);
    }

    // --- MONGO DB MODE ---
    const query = {};

    if (category) {
      query.category = category;
    }

    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let queryPromise = Product.find(query);

    if (sort === 'Price Low to High') {
      queryPromise = queryPromise.sort({ price: 1 });
    } else if (sort === 'Price High to Low') {
      queryPromise = queryPromise.sort({ price: -1 });
    } else if (sort === 'Discount') {
      queryPromise = queryPromise.sort({ discount: -1 });
    } else if (sort === 'Popular') {
      queryPromise = queryPromise.sort({ rating: -1 });
    } else {
      queryPromise = queryPromise.sort({ createdAt: -1 });
    }

    const products = await queryPromise;
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to fetch products' });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const product = global.mockProducts.find(p => p._id === req.params.id);
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // --- MONGO DB MODE ---
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to fetch product details' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, image, category, gender, stock, rating } = req.body;

    if (!title || !description || !price || !image || !category) {
      return res.status(400).json({ message: 'Title, description, price, image, and category are required' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const newProduct = {
        _id: `mock_prod_${Date.now()}`,
        title,
        description,
        price: parseFloat(price),
        discount: parseInt(discount) || 0,
        image,
        category,
        gender: gender || 'Unisex',
        stock: parseInt(stock) || 10,
        rating: parseFloat(rating) || 4.0,
        createdAt: new Date()
      };

      global.mockProducts.push(newProduct);
      return res.status(201).json(newProduct);
    }

    // --- MONGO DB MODE ---
    const product = new Product({
      title,
      description,
      price,
      discount: discount || 0,
      image,
      category,
      gender: gender || 'Unisex',
      stock: stock || 10,
      rating: rating || 4.0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to create product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { title, description, price, discount, image, category, gender, stock, rating } = req.body;

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const idx = global.mockProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        const prod = global.mockProducts[idx];
        const updatedProduct = {
          ...prod,
          title: title !== undefined ? title : prod.title,
          description: description !== undefined ? description : prod.description,
          price: price !== undefined ? parseFloat(price) : prod.price,
          discount: discount !== undefined ? parseInt(discount) : prod.discount,
          image: image !== undefined ? image : prod.image,
          category: category !== undefined ? category : prod.category,
          gender: gender !== undefined ? gender : prod.gender,
          stock: stock !== undefined ? parseInt(stock) : prod.stock,
          rating: rating !== undefined ? parseFloat(rating) : prod.rating
        };
        global.mockProducts[idx] = updatedProduct;
        return res.json(updatedProduct);
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // --- MONGO DB MODE ---
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title !== undefined ? title : product.title;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? price : product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.image = image !== undefined ? image : product.image;
      product.category = category !== undefined ? category : product.category;
      product.gender = gender !== undefined ? gender : product.gender;
      product.stock = stock !== undefined ? stock : product.stock;
      product.rating = rating !== undefined ? rating : product.rating;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to update product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const idx = global.mockProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        global.mockProducts.splice(idx, 1);
        return res.json({ message: 'Product removed successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // --- MONGO DB MODE ---
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
