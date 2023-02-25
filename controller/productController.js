const Product = require("../models/product")
exports.getAllProducts =  async (req, res) => {
  try {
    const data = await Product.find({});
    res.send(data);
  } catch (error) {
    console.log(error);
  }
}
