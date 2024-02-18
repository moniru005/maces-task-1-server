const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mumbaicluster.krljslb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const submissionsCollection = client.db("maces").collection("submitForm");

    // Submission API
    app.post("/submit", async (req, res) => {
      const {firstName, lastName, email, phone, message } = req.body;

      // Check if First Name already exists
      const existingFirstName = await submissionsCollection.findOne({firstName});
      if (existingFirstName) {
        return res.status(400).json({ error: "Duplicate 'First Name' detected" });
      }
      // Check if Last Name already exists
      const existingLastName = await submissionsCollection.findOne({lastName});
      if (existingLastName) {
        return res.status(400).json({ error: "Duplicate 'Last Name' detected" });
      }
      // Check if Email already exists
      const existingEmail = await submissionsCollection.findOne({email});
      if (existingEmail) {
        return res.status(400).json({ error: "Duplicate 'Email' detected" });
      }
      // Check if Phone already exists
      const existingPhone = await submissionsCollection.findOne({phone});
      if (existingPhone) {
        return res.status(400).json({ error: "Duplicate 'Phone' detected" });
      }
      // Check if Message already exists
      const existingMessage = await submissionsCollection.findOne({message});
      if (existingMessage) {
        return res.status(400).json({ error: "Duplicate 'Message' detected" });
      }
     
      
      // If not duplicate, save the submission
      await submissionsCollection.insertOne({firstName, lastName, email, phone, message});

      res.json({message: "Submission Successful"});

    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Submission Form");
});

app.listen(port, () => {
  console.log(`Submission form running on: ${port}`);
});
