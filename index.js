const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y6l8m1u.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const productCollection = client.db('bikeMart').collection('products');
        const usersCollection = client.db('bikeMart').collection('users');
        const bookingCollection = client.db('bikeMart').collection('bookings');

        app.get('/products', async(req, res) => {
            const query = {};
            const options = await productCollection.find(query).limit(3).toArray();
            res.send(options);
        })

        app.post('/products', async(req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        app.get('/allproducts', async(req, res) => {
            const query = {};
            const options = await productCollection.find(query).toArray();
            
            res.send(options);
        })

        app.get('/allproducts/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email};
            const sellerproducts = await productCollection.find(query).toArray();
            res.send(sellerproducts);
        })

        app.get('/allproducts/:category_id', async(req, res) => {
            const category_id = req.params.category_id;
            const query = {category_id};
            const items = await productCollection.find(query).toArray();
            res.send(items);
        })

        app.get('/allproducts/:id', async(req, res) => {
            const id = req.params.id;
            const query = {category_id};
            const items = await productCollection.findOne(query);
            console.log(query);
            res.send(items);
        })

        app.get('/users', async(req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users/sellers', async(req, res) => {
          const sellers = req.body;
           const query = {"role" : "seller" };
           const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/users/buyers', async(req, res) => {
            const buyers = req.body;
             const query = {"role" : "buyer" };
             const result = await usersCollection.find(query).toArray();
              res.send(result);
          })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isAdmin: user?.role === 'admin'})
        })

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isSeller: user?.role === 'seller'})
        })

        app.get('/users/buyer/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email};
            const user = await usersCollection.findOne(query);
            res.send({isBuyer: user?.role === 'buyer'})
        })

        app.get('/bookings', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        app.post('/bookings', async(req, res) => {
            const booking = req.body
            const query = {
                productName: booking.productName,
                email: booking.email
            }

            const alreadyBooked = await bookingCollection.find(query).toArray();

            if(alreadyBooked.length){
                const message = `${booking.productName} is already booked`;
                return res.send({acknowledged: false, message})
            }
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
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
