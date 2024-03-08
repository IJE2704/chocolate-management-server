const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//midleware
app.use(cors());
app.use(express.json());

// chocolate-manager
// lyOSBfEMQhnnceWs
// console.log(process.env.MU);

const uri = `mongodb+srv://${process.env.MU}:${process.env.AP}@cluster0.oenz0rl.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const chocolateCollection = client.db('ChocolateCB').collection('Chocolate');


    app.get('/chocolate', async(req,res)=>{
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/chocolate/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await chocolateCollection.findOne(query);
      res.send(result);
    })

    //get data from client side and send it to database
      app.post('/chocolate', async(req,res)=>{
        const newChocolate = req.body;
        console.log(newChocolate);
        const result = await chocolateCollection.insertOne(newChocolate);
        res.send(result);
      })

      // get req from client to update data
      app.put('/chocolate/:id', async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert:true}
        const updateChocolate = req.body;
        console.log(req.body)
        const chocolate = {
          $set:{
            name:updateChocolate.name,
            country:updateChocolate.country,
            category:updateChocolate.category,
            image:updateChocolate.image
          }
        }
        const result = await chocolateCollection.updateOne(filter,chocolate,options);
        res.send(result);
      })

      //get request from client for delete data from database
      app.delete('/chocolate/:id', async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const query = {_id: new ObjectId(id)};
        console.log(id)
        const result = await chocolateCollection.deleteOne(query);
        res.send(result);
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
  res.send('Chocolate shop is running');
})
app.get('/demo', (req,res)=>{
  res.send('Chocolate shop is running');
})

app.listen(port, () =>{
  console.log(`coffee server is running on port:${port}`);
})