const express=require('express');
const router=express.Router();
const emailService=require('./emailService')
const url=require('url')

const settings = {
    connectionString: "mongodb+srv://serviceworker:Almaz$321@cluster0.m1zui.mongodb.net/vitelschool"
}

const mongodb = require('mongodb');
const axios = require('axios');
const { resourceLimits } = require('worker_threads');

async function loadDataCollection(collectionName) {
    const client = await mongodb.MongoClient.connect(settings.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return client.db(settings.dbname).collection(collectionName)
}

console.log("orders for dashboard")

//test api
//const baseUrl="https://3dsec.sberbank.ru/payment/rest/"
//const authString="userName=T150408895112-api&password=T150408895112"
//production api
const baseUrl="hhttps://securepayments.sberbank.ru/payment/rest/"
const authString="userName=P150408895112-api&password=Almaz$321"

let returnUrl="returnUrl=https://vitelschool.ru/orders"



router.get('/',async (req,res)=> {
    let orderId=url.parse(req.url,true).query.orderId
    if (orderId) {
        console.log(orderId)
        //get orderNumber from database
        let ordersCol=await loadDataCollection("orders")
        let orders=await ordersCol.find({"sberOrderId":orderId}).toArray()
        if (orders.length>0) {
            let orderNumber=orders[0]._id.toString()
            console.log(orderNumber, orderId)
            //checking order status from sber
            await axios.get(baseUrl+"getOrderStatusExtended.do?"+authString+"&orderId="+orderId+"&orderNumber"+orderNumber).then(async (result)=> {
                console.log(result.data)
                //updtaing order status personal database
                await ordersCol.updateOne({"_id":mongodb.ObjectId(orderNumber)},{$set:{"payed":true, "sberResponse":result.data}}).then((r2)=> {
                    //email notification
                    let htmlEmailBody="<h2>Заказ №" + orderId+"</h2><h3>На сумму "+ parseFloat(result.data.amount)/100 +"рублей - Успешно оплачен!</h3><br>";
                    htmlEmailBody+="<h3><a href='https://vitelschool.ru/orders?orderId="+orderId.toString()+"'>Ваша постоянная ссылка на мастер-класс</a></h3><hr><br>";
                    htmlEmailBody+="<h3>C уважением, команда VitelSchool</h3>"

                    emailService.sendEmail(result.data.payerData.email,htmlEmailBody,"VitelSchool = Заказ №"+orderId+ " (оплачен)")
                    //emailService.sendEmail("bogoslavec_viktoriya@mail.ru",htmlEmailBody,"VitelSchool = Заказ №"+orderId+ " (оплачен)")
                    //returning data
                    res.status(200).send({
                        "orderId":orderId,
                        "paymentStatus":result.data.orderStatus
                    })
                })
            }).catch(err=> {
                console.log(err)
                res.status(501).send("payment gateway error")
            })
        }
    }
    else {
        res.status(200).send("orderId is required")
    }
})

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
            "payed":false,
            "sberOrderId":null
        }).then(async (r)=> {
            orderNumber=r.insertedId.toString()
            await axios.get(baseUrl+"register.do?"+authString+"&"+returnUrl+"&orderNumber="+orderNumber.toString()+"&amount="+req.body.amount+"00").then(async (result)=> {
                console.log(result.data)
                //updating order
                await ordersCols.updateOne({_id:mongodb.ObjectId(r.insertedId.toString())},{$set:{"sberOrderId":result.data.orderId}}).then((r2)=> {
                    console.log(r2);
                    res.status(201).send(result.data)
                }).catch((err2)=> {
                    res.status(501).send("Payment gateway unavailable")
                })
                
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