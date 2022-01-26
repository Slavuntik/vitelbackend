const express=require('express');
const router=express.Router();
const emailService=require('./emailService')

console.log("orders for dashboard")

router.get('/',(req,res)=> {
    res.status(200).send("test ok")
})

router.post('/',(req,res)=> {
    if (req.body.message) {
        emailService.sendEmail("vyacheslavaf@gmail.com",req.body,"inquery from website").then((r)=> {
            res.status(201).send(r)
        }).catch((err)=> {
            res.status(500).send(err)
        })
    }
})


module.exports=router