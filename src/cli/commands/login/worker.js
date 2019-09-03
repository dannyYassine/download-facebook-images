/**
 * Created by dannyyassine
 */
const path = require('path');
const express = require('express');
const app = express()
const port = process.argv[2];
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.resolve(__dirname, 'site')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/site/index.html'));
})

app.post('/', async (req, res) => {
  res.send('Thanks!');
  process.send({token: req.body.token});
})

app.listen(port, () => {});