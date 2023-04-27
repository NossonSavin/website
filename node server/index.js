const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;
var path = require('path');

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb******************************';
const client = new MongoClient(uri);

let score;

app.set('etag', false);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
})

app.use(async (req, res, next) => {
  await client.connect();
  scoreDB = await client.db('*******').collection('*********');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/score', async (req, res) => {
  const result = await scoreDB.findOne({ '*******': '*******' });

  res.setHeader('Content-Type', 'application/json');
  res.end(`{"score":${result.namehere}}`);
});

app.use('/setScore', async (req, res) => {
  const result = await scoreDB.updateOne({ namehere: newdata }, { $set: { namehere: req.body.newScore } });

  res.end('ok');
});

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
