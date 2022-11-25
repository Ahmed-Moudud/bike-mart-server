const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://<username>:<password>@cluster0.y6l8m1u.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/', async(req, res) => {
    res.send('bike mart server is running')
})

app.listen(port, () => console.log(`Bike mart server is running on ${port}`));
