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
        const itemCollection = client.db('geniusCar').collection('ritems');

        // get all items
        app.get('/items', async (req, res) => {
            const query = {};
            if (req.query.supplier) query.supplier = req.query.supplier;
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // insert single item
        app.post('/items', async (req, res) => {
            await itemCollection.insertOne(req.body);
            res.json({ message: 'ok' });
        });

        // get single item
        app.get('/items/:id', async (req, res) => {
            const query = {
                _id: ObjectId(req.params.id),
            };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        // delete single item
        app.delete('/items/:id', async (req, res) => {
            const query = {
                _id: ObjectId(req.params.id),
            };
            await itemCollection.deleteOne(query);
            res.json({ message: 'ok' });
        });

        // update single item
        app.put('/items/:id', async (req, res) => {
            const query = {
                _id: ObjectId(req.params.id),
            };
            await itemCollection.updateOne(query, {
                $set: req.body,
                $currentDate: { lastModified: true },
            });
            res.json({ message: 'ok' });
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
