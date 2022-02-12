const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const app=express()
app.use(bodyParser({limit: '10mb'}));
app.use(bodyParser.json())
app.use(cors())

//const emailService=require('./common/emailService');
const forms=require('./routes/forms');
app.use('/forms',forms);

const checkemail=require('./routes/checkemail');
app.use('/checkemail',checkemail);

const subscribe=require('./routes/subscribe');
app.use('/subscribe',subscribe);

const checkpromo=require('./routes/checkpromo');
app.use('/checkpromo',checkpromo);


if (process.env.NODE_ENV==='production') {
    console.log('production')
    app.use(express.static(__dirname+'/public/'));
    //handle SPA
    app.get(/.*/, (req, res)=> {
        console.log('sending index.html')
        res.sendFile(__dirname, +'/public/index.html');
    })
    console.log(__dirname)
}

var port=process.env.PORT || 19999;


app.listen(port,()=> {
    console.log(`Server started on port ${port}`)
});
