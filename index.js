const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vwx9p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// client.connect((err) => {
//     const collection = client.db('test').collection('devices');
//     console.log('DB connected!');
//     client.close();
// });

async function run() {
    try {
        await client.connect();
        console.log('DB connected.');
        const serviceCollection = client.db('geniusCar').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const query = {
                _id: ObjectId(req.params.id),
            };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
    } finally {
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running...');
});

app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});
