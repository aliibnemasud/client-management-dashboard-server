const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Client Management Server is Running.....");    
})


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@client-management-dashb.a5l02mz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {

    try {
        await client.connect();
        const clientsCollection = client.db('clients-server').collection('clients');

         // Get all clients

         app.get('/clients', async (req, res) => {
            const query = {};
            const cursor = clientsCollection.find(query);
            const clients = await cursor.toArray();
            res.send(clients);
        })
        
        // add new clients

        app.post('/client', async (req, res) => {
            const client = req.body;
            const result = await clientsCollection.insertOne(client);
            res.send(result);
        })

        // Get access Token

        app.post('/login', async (req, res)=> {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.SECRET_KEY, {
                expiresIn: '1d'
            })
            res.send({accessToken});
        })


        
        




    }

    finally {

        // client.close //

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log('My port is running', port);
})