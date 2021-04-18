const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const  ObjectId  = require('mongodb').ObjectID;
require('dotenv').config();


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kypi0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const reviewCollection = client.db("destination-anywhere").collection("reviews");
  
  // send review info to server
  app.post ('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result =>{
       res.send(result.insertedCount>0);
    })
  })

  app.get('/showreviews', (req,res) => {
    reviewCollection.find()
    .toArray((err, items) => {
      res.send(items)
      
    })
  })


const serviceCollection = client.db("destination-anywhere").collection("services");
  // send service info to server
  app.post ('/addService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
    .then(result =>{
       res.send(result.insertedCount>0);
    })
  })

  app.get('/services', (req,res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      
    })
  })



// send admin info to server
  const adminCollection = client.db("destination-anywhere").collection("admins");
  app.post ('/addAdmin', (req, res) => {
    const newReview = req.body;
    adminCollection.insertOne(newReview)
    .then(result =>{
       res.send(result.insertedCount>0);
    })
  })

  // send booking info to server
  const bookingCollection = client.db("destination-anywhere").collection("bookings");
  app.post('/addBooking', (req, res) => {
    const booking = req.body;
    bookingCollection.insertOne(booking)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
});

 app.get('/dashboard/booking/:id', (req,res) => {
    serviceCollection.find({_id: ObjectId (req.params.id)})
    .toArray((err, items) => {
      console.log(items)
      res.send(items[0]);
      
    })
  })

});

app.post('/bookingsByEmail', (req, res) => {
  const date = req.body;
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, documents) => {
          const filter = { date: date.date }
          if (documents.length === 0) {
              filter.email = email;
          }
          bookingCollection.find(filter)
              .toArray((err, docs) => {
                  console.log(email, date.date, doctors, documents)
                  res.send(docs);
              })
      })

      app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents.length > 0);
            })
    })
})





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })