const express=require('express');
const router=express.Router();
const emailService=require('./emailService')

const settings = {
    connectionString: "mongodb+srv://serviceworker:Almaz$321@cluster0.m1zui.mongodb.net/vitelschool"
}

const mongodb = require('mongodb');
const axios = require('axios');

async function loadDataCollection(collectionName) {
    const client = await mongodb.MongoClient.connect(settings.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return client.db(settings.dbname).collection(collectionName)
}

console.log("orders for dashboard")

router.get('/',(req,res)=> {
    res.status(200).send("test ok")
})

const baseUrl="https://3dsec.sberbank.ru/payment/rest/register.do?"
const authString="userName=T150408895112-api&password=T150408895112"
let returnUrl="returnUrl=https://vitelschool.ru/order/"

router.post('/',async (req,res)=> {
    if (req.body.amount) {
        console.log(req.body.amount)
        let ordersCols=await loadDataCollection("orders")
        let orderNumber=null
        await ordersCols.insertOne({
            "timeStamp":Date.now(),
            "amount":req.body.amount,
            "sku":1,
            "email":req.body.email,
            "payed":false
        }).then(async (r)=> {
            orderNumber=r.insertedId.toString()
            await axios.get(baseUrl+authString+"&"+returnUrl+"&orderNumber="+orderNumber.toString()+"&amount="+req.body.amount+"00").then((result)=> {
                console.log(result.data)
                res.status(201).send(result.data)
            }).catch((err)=> {
                console.log(err)
            })
    
        })
    }
    else {
        res.status(501).send("No parameters set")
    }
})

module.exports=router