const express = require("express");
const router = express.Router();
const Association = require("../../models/association");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
router.use(express.json());
router.use(cookieParser());

const { upload } = require("../../controller/UserController");

const {
    addDonation,
    getAllDonation,
    getDonationsByFunding,
    deleteDonation
} = require("../../controller/DonationController");

router.post("/addDonation", addDonation); 
router.get("/getAllDonation", getAllDonation); 
router.get("/getDonationsByFunding/:id", getDonationsByFunding); 
router.delete("/deleteDonation/:id", deleteDonation); 




// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MO6acCtEnCuXLXdl7MVHVXkr16mFXBCDhG7dU7h1oyLzVyCzLWjfe02fjWAXwoiRO9DZrwlmhWrJkoKOgxB6ZgX00MTt3yegm');
 

const YOUR_DOMAIN = "http://localhost:3001/confirmDonation";

router.post('/create-checkout-session/:price/:id/:funding', async (req, res) => {
    const price = await stripe.prices.create({
      unit_amount: req.params.price * 100,
      currency: "usd",
      product_data: {
        name: req.params.funding, 
      },
    });


  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true&total=${req.params.price}&funding=${req.params.funding}&id=${req.params.id}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});
 


module.exports = router;
