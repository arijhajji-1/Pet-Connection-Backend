const Product = require("../models/product")
exports.getAllProducts =  async (req, res) => {
  try {
    const data = await Product.find({});
    res.send(data);
  } catch (error) {
    console.log(error);
  }
}
exports.addNewProduct = async (req, res, next) => {
    const product = new Product(req.body);

    try{
        const savedProduct = await product.save();
        res.status(200).json(savedProduct)
    }catch (err){
        res.status(500).json(err);
    }
}
exports.updateProduct = async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.send("Product Updated")
    } catch (error) {
      console.log(error);
    }
  }
exports.deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndRemove(req.params.id);
      res.send("Product Deleted")
    } catch (error) {
      console.log(error);
    }
  }


//find avec category :http://localhost:3000/getAllF?category=aaa
//new=true w ta3tini 1 puisque limit(1):http://localhost:3000/getAllF?new=true
exports.getAll = async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1)
        } else if(qCategory){
            products = await Product.find({categories:{
                $in: [qCategory],
            },
        });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err){
        console.log(err);
    }
}
  
exports.getProductById = async (req, res) => {
    try {
      const data = await Product.findById(req.params.id);
      res.send(data)  
    } catch (error) {
      console.log(error);
    }
  }