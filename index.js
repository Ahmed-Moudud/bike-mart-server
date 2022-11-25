const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y6l8m1u.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const productCollection = client.db('bikeMart').collection('products');

        app.get('/products', async(req, res) => {
            const query = {};
            const options = await productCollection.find(query).limit(3).toArray();
            res.send(options);
        })

        app.get('/allproducts', async(req, res) => {
            const query = {};
            const options = await productCollection.find(query).toArray();
            res.send(options);
        })

        app.get('/products/:category', async(req, res) => {
            const category = req.params.category;
            const query = {category};
            const items = await productCollection.find(query).toArray();
            res.send(items);
        })
    }
    finally{

    }
}

run().catch(console.log());

app.get('/', async(req, res) => {
    res.send('bike mart server is running')
})

app.listen(port, () => console.log(`Bike mart server is running on ${port}`));
