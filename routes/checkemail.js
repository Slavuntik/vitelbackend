const express=require('express');
const router=express.Router();
const emailService=require('./emailService')
const url=require('url')

console.log("email confirmation")

router.get('/',(req,res)=> {
    let orderId=url.parse(req.url,true).query.orderId
    if (orderId) {
        console.log(orderId)
    }
    res.status(200).send("test ok")

})



module.exports=router