//Module 48
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {ObjectId}=require('mongodb')
// const password=f1234567
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Mohammed-Farhad-Uddin:f1234567@cluster0.p8xf6.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})



client.connect(err => {
  const collection = client.db("organicdb").collection("products");
  // perform actions on the collection object
  //crud=createData(post),readData(get),updateData(update),deleteData(delete)
  
  //GET 
  app.get('/products',(req,res)=>{
    // collection.find({}).limit(3)
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  //UPDATE
  app.get('/loadToUpdateProduct/:id',(req,res)=>{
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])//array er modde ek ta jehetu takbe tao 0 index er ta patai dibe object akare
    })
  })

  app.patch('/updateProuct/:id',(req,res)=>{
    collection.updateOne({_id:ObjectId(req.params.id)},
    {
      $set:{price:req.body.price,quantity:req.body.quantity}//mongoDB guide er crud er update e gele kemne korce ei sob buja jabe.ei kane prothon price hocce property tarpor res.body.price holo value
    
    }
    )
    .then(result=>{
      console.log(result)
      res.send(result.matchedCount>0)
    })
  })

  //POST
  app.post('/addProduct',(req,res)=>{
    const product=req.body;
    // console.log(product)
    collection.insertOne(product)
    .then(result=>{
      console.log('product added')
      // res.send("success")
      res.redirect('/')
    })
  })


  //DELETE
  app.delete('/delete/:id',(req,res)=>{ 
    // console.log(req.params.id)
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      console.log(result)
      // res.send(result)
      res.send(result.deletedCount>0)//result k console korle deleteCount pawa jabe and kicu delete korle 1 value hobe.ei value 1 hole true hoye res ta send hobe
    })
  })
  
});


app.listen(3000)