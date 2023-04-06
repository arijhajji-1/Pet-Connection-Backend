const Product = require("../models/product");



exports.add = async (req,res) => {
    let imgsrc = 'http://127.0.0.1:3000/images/' + req.file.originalname;
    let product = new Product({
        name: req.body.name,
        desc: req.body.desc,
        img: imgsrc,
        categories: req.body.categories,
        price: req.body.price,
    });
    try{
        let savedProduct = await product.save();
        return res.status(200).json(savedProduct)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}

exports.getAll = async(req,res) => {
    await Product.find({}).then(products=>{
        return res.status(200).json(products);
    }).catch(err=>{
        return res.status(500).json(err);
    });
}

exports.search = async(req,res) => {
    await Product.find(
        {$or: [
                {name: { $regex: '.*' + req.body.search + '.*' }},
                {desc: { $regex: '.*' + req.body.search + '.*' }}]
        }).then(products=>{
        return res.status(200).json(products);
    }).catch(err=>{
        return res.status(500).json(err);
    });
}

exports.findById = async(req,res) => {
    console.log(req.params.id)
    await Product.findOne({_id:req.params.id}).then(product=>{
        console.log(product)
        return res.status(200).json(product);
        
    }).catch(err=>{
        return res.status(500).json(err);
    });
}

exports.update = async(req,res)=>{
    const product=await Product.findOne({_id:req.body._id});
    await Product.findByIdAndUpdate(product._id,req.body)
    await Product.findOne({_id:product._id}).then((p)=>{
        return res.status(200).json(p);
    }).catch(err=>{
        return res.status(500).json(err);
    });
}

exports.delete = async(req,res)=>{
    await Product.deleteOne({_id:req.params.id})
        .then(()=>{
            res.status(200).json("Product deleted");
        }).catch(function(error){
            return res.status(500).json(error);
        });
}
