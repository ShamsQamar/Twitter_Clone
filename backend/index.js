const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const ObjectId = require('mongodb').ObjectId;
const FCM = require('fcm-node');

app.use(cors());
app.use(express.json());
dotenv.config();

//fcm
const serverKey = process.env.Service_key;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfkfvvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-v0ng2b1-shard-00-00.kfkfvvs.mongodb.net:27017,ac-v0ng2b1-shard-00-01.kfkfvvs.mongodb.net:27017,ac-v0ng2b1-shard-00-02.kfkfvvs.mongodb.net:27017/?ssl=true&replicaSet=atlas-ep265f-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

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
    console.log("You successfully connected to MongoDB!");
    const postCollection = client.db('database').collection('posts'); // this is post collection
    const userCollection = client.db('database').collection('users'); // this is users collection
    const notificationCollection = client.db('database').collection('notifications'); // this is notifications collection
    const tokenCollection = client.db('database').collection('tokens');
    //get 
    app.get('/post', async (req, res) => {
      const posts = (await postCollection.find().toArray()).reverse();
      res.send(posts);
    })

    app.get('/user', async (req, res) => {
      const user = await userCollection.find().toArray();
      res.send(user);
    })

    app.get('/loggedInUser', async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.findOne({ email: email });
      res.send(user);
    })

    app.get('/getNotifications', async (req, res) => {
      const notifications = (await notificationCollection.find().toArray()).reverse();
      res.send(notifications);
    })

    app.get('/tokens', async (req, res) => {
      const data = await tokenCollection.findOne();
      const tokens = data.tokens;
      res.send(tokens);
    })

    //phone user
    app.get('/phoneUser', async (req, res) => {
      const phone = req.query.phone;
      const user = await userCollection.findOne({ phoneNumber: phone });
      res.send(user);
    })

    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      const post = (await postCollection.find({ email: email }).toArray()).reverse();
      res.send(post);
    })

    //post
    app.post('/post', async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    })

    app.post('/register', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.post('/notification', async (req, res) => {
      const notify = req.body;
      const result = await notificationCollection.insertOne(notify);
      res.send(result);
    })

    app.post('/send', async (req, res) => {
      const tokens = req.body.tokens;
      const fcm = new FCM(serverKey);
      tokens.forEach(token => {
        const message = {
          to: token,
          notification: {
            title: req.body.title,
            body: req.body.body
          },
          data: {  //you can send only notification or only data(or include both)
            actionBy: req.body.actionBy,
            message: 'Notification received successfully',
            language: req.body.language
          }
        }

        fcm.send(message, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!");
          } else {
            console.log("Successfully sent with response: ");
          }
        })
      });
      res.send('success');
    })

    //patch 
    app.patch('/userUpdates/:email', async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    app.patch('/addComment/:_id', async (req, res) => {
      const filter = req.params;
      filter._id = new ObjectId(req.params._id);
      const user = req.body;
      const options = { upsert: true };
      const updateDoc = { $push: { "comments": user } };
      await postCollection.updateOne(filter, updateDoc, options);
      const post = await postCollection.findOne({ _id: filter._id });
      res.send(post);
    })

    app.patch('/addLike/:_id', async (req, res) => {
      const filter = req.params;
      filter._id = new ObjectId(req.params._id);
      const email = req.body.email;
      const options = { upsert: true };
      const updateDoc = { $push: { "likes": email } };
      const post = await postCollection.findOne({ _id: filter._id });
      if (email && !(post.likes.includes(email))) {
        const result = await postCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      } else { res.send({ message: 'user already liked it before' }) }
    })

    app.patch('/removeLike/:_id', async (req, res) => {
      const filter = req.params;
      filter._id = new ObjectId(req.params._id);
      const email = req.body.email;
      const updateDoc = { $pull: { "likes": email } };
      const post = await postCollection.findOne({ _id: filter._id });
      if (email && post.likes.includes(email)) {
        const result = await postCollection.updateOne(filter, updateDoc);
        res.send(result);
      } else { res.send({ message: 'something went wrong' }) }
    })

    app.patch('/muteUser/:email', async (req, res) => {
      const filter = req.params;
      const email = req.body.email;
      const options = { upsert: true };
      const user = await userCollection.findOne(filter);
      const exist = user.muted ? user.muted.includes(email) : false;
      if (exist) {
        res.send({ message: 'already muted' })
      }
      else {
        const updateDoc = { $push: { "muted": email } };
        await userCollection.updateOne(filter, updateDoc, options);
        res.send({ message: 'successfully muted' });
      }
    })

    app.patch('/unmuteUser/:email', async (req, res) => {
      const filter = req.params;
      const email = req.body.email;
      const user = await userCollection.findOne(filter);
      const exist = user.muted ? user.muted.includes(email) : false;
      if (exist) {
        const updateDoc = { $pull: { "muted": email } };
        await userCollection.updateOne(filter, updateDoc);
        res.send({ message: 'successfully unmuted' });
      }
      else {
        res.send({ message: 'never muted' });
      }
    })

    app.patch('/deletePost/:_id', async (req, res) => {
      const filter = req.params;
      filter._id = new ObjectId(req.params._id);
      const result = await postCollection.deleteOne(filter);
      res.send(result);
    })

    app.patch('/addToken', async (req, res) => {
      const data = await tokenCollection.findOne();
      const tokens = data.tokens;
      if (!(tokens.includes(req.body.token))) {
        const options = { upsert: true };
        const updateDoc = { $push: { "tokens": req.body.token } };
        const result = await tokenCollection.updateOne({}, updateDoc, options);
        res.send(result);
      } else res.send({ message: 'token already stored' });
    })

  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("welcome to server");
})

app.listen(port, () => {
  console.log(`Twitter is live on ${port}`);
})