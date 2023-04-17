const express = require('express')
const router = express.Router();
const bodyparser = require("body-parser")
const CouponController = require('../../controller/orderController');
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")
const Coupon = require("../../models/Coupon");

router.use(express.json())
router.use(cookieParser())


router.post("/addCoupon", async (req, res) => {
    const newCoupon = new Coupon(req.body);
    try {
      const savedCoupon = await newCoupon.save();
      res.status(200).json(savedCoupon);
    } catch (err) {
      res.status(500).json(err);
    }
  });
router.put("/updateCoupon/:id",async (req,res) => {
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id,
            {$set: req.body,
             },
             {new: true}
             );
             res.status(200).json(updatedCoupon);
    }catch (err){
        res.status(500).json(err)
    }
})
router.delete("/deleteCoupon/:id",async (req, res) => {
    try {
      await Coupon.findByIdAndDelete(req.params.id);
      res.status(200).json("Product Deleted")
    } catch (error) {
        res.status(500).json(err);
    }
  })
router.get("/getAllCoupon",async (req, res) => {
    try{
        const Coupons = await Coupon.find()
        res.status(200).json(Coupons)
    }catch(err){
        res.status(500).json(err)
    }

  })
router.get("/isCodeExiste/:code",async(req,res)=>{
    const coupon=await Coupon.findOne({code:req.params.code});
    if(coupon!=null){
        return res.status(200).json({
            "isExiste":true,
            "coupon":coupon,
        })
    }else{
        return res.status(200).json({
            "isExiste":false,
        })
    }
})







module.exports = router; 
