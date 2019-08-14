/**
 * Created by dannyyassine
 */
const fs = require('fs');
const path = require('path');
const { promisify }= require('util');
const writeFile = promisify(fs.writeFile);
const express = require('express');
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.resolve(__dirname, 'site')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/site/index.html'));
})

app.post('/', async (req, res) => {
  res.send('Thanks!');
  const filePath = path.resolve(__dirname, '../../', '.temp', 'user.json');
  await writeFile(filePath, JSON.stringify({token: req.body.token}), 'utf8');
  process.send({token: req.body.token});
})

app.listen(port, () => {});