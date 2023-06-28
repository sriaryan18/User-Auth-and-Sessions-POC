const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const MONGO_URI = 'mongodb://localhost:27017/mongo-sessions';

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'iamsecret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get('/', (req, res) => {
  if (!req.session.count) {
    req.session.count = 1;
  } else {
    req.session.count++;
  }
  req.session.save(); // Save the session after updating the data
  res.send('Count: ' + req.session.count);
});

app.post('/save-info',(req,res)=>{
    // console.log("I am req",req);
    if(req.session){
        req.session.info=req.body.dataaa;
        res.send("Saved the data")
    }else{
        res.send('No session found')
    }
})

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3003, () => {
      console.log('Server listening on port 3003');
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });
