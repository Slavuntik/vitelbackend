const express=require('express');
const router=express.Router();
const emailService=require('./emailService')

console.log("email confirmation")

router.get('/',(req,res)=> {
    res.status(200).send("test ok")
})



module.exports=router