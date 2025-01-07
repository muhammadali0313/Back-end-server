app.post('/orders', authenticate, async (req, res) => {
    const { products } = req.body;
    const productDocs = await Product.find({ _id: { $in: products } });
    const totalPrice = productDocs.reduce((sum, p) => sum + p.price, 0);
  
    const order = new Order({
      user: req.user.id,
      products,
      totalPrice,
    });
    await order.save();
    res.status(201).json(order);
  });
  
  // List Orders
  app.get('/orders', authenticate, async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('products');
    res.json(orders);
  });
  
  // Get Order by ID
  app.get('/orders/:id', authenticate, async (req, res) => {
    const order = await Order.findById(req.params.id).populate('products');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  });