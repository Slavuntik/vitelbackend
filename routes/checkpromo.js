const express=require('express');
const router=express.Router();
const emailService=require('./emailService')

const settings = {
    connectionString: "mongodb+srv://serviceworker:Almaz$321@cluster0.m1zui.mongodb.net/test"
}

const mongodb = require('mongodb');

async function loadDataCollection(collectionName) {
    const client = await mongodb.MongoClient.connect(settings.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return client.db(settings.dbname).collection(collectionName)
}


console.log("email confirmation")

router.post('/',async (req,res)=> {
    res.status(200).send("subscribe test ok")
    if (req.data.promoCode) {
        let codesCol=await loadDataCollection('promocodes')
        let codes=await codesCol.find({"promoCode":req.data.promoCode}).toArray()
        if (codes.length>0) {
            res.status(200).send({
               "promoCode":codes[0].promoCode,
               "discount":codes[0].discount,
               "active":true
            })
        }
        else {
            res.status(200).send({
                "discount":"0",
                "active":false
            })
        }
    }
    else {
        res.status(200).send({
            "active":false
        })
    }
})





module.exports=router