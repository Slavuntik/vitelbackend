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

router.get('/',(req,res)=> {
    res.status(200).send("subscribe test ok")
})

router.post('/',async (req,res)=> {
    if (req.body) {
        if (req.body.email) {
            //checking in database
            console.log(req.body.email)
            let subsCol=await loadDataCollection('subscriptions')
            let subscriptions=await subsCol.find({"email":req.body.email}).toArray()
            if (subscriptions.length==0) {
                await subsCol.insertOne({"email":req.body.email,"confirmed":0})
                emailService.sendEmail(req.body.email,"<h1>Thanx4Registration</h2><br><h3>Спасибо за регистрацию!</h3>","Ваш промокод для VitelSchool")
                res.status(201).send("email succesfully added")
            }
            else {
                res.status(200).send("already subscribed")
            }
        }
        else {
            res.status(400).send();
        }
    }
    else {
        res.status(400).send();
    }
})



module.exports=router