const stripe = require("stripe")("sk_test_51MgaqwHbRAiFliiN7f1Z9CjQbYk2AIgcQNYluM2W6Xqr0wTh5VaqMtNftLyWUrP8p0Zig5NMpiRs5alJsaYKQKE900JGqXzQTL");
  

exports.create=async(req,res)=>{
    prix=req.body.prix;
    stripe.paymentIntents.create({
        amount: prix,
        currency: "eur",
    }).then((payment)=>{
        res.status(200).send({
            clientSecret: payment.client_secret,

        })
      }).catch((err)=>{
        console.log(err);
      });

}