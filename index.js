const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MPDB_USER}:${process.env.MPDB_PASS}@cluster0.cnar9k1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const toyCollection=client.db('toyMarketplace').collection('toyCollection');

    app.get('/allToys', async(req,res)=>{
      const cursor=toyCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })


    app.post('/allToys',async(req,res)=>{
      const toyDetails=req.body;
      console.log(toyDetails);
      const result=await toyCollection.insertOne(toyDetails);
      res.send(result);
    });

    
    app.get('/allToys',async(req,res)=>{
      let query={};
      if(req.query?.email){
        query={email:req.query.email}
      }
      const result =await toyCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/allToys/:id',async (req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await toyCollection.findOne(query);
      res.send(result);
    })

    app.delete('/allToys/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await toyCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Toy Marketplace Server is Running')
})

app.listen(port,()=>{
    console.log(`toy marketplace running at port:${port}`)
})