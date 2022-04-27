const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Password: zayeC7r5K9beINUo

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Mongo DB

const uri =
  "mongodb+srv://riyad:zayeC7r5K9beINUo@notestakercluster.6lrys.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("noteDB").collection("notes");

    // GET API
    app.get("/notes", async (req, res) => {
      const query = req.query;
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST  API
    app.post("/note", async (req, res) => {
      const data = req.body;
      const result = await notesCollection.insertOne(data);
      res.send(result);
    });

    // PUT API
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          user_name: data.user_name,
          text: data.text,
        },
      };
      const result = await notesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // DELETE API
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await notesCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
