const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const router = require('./routes');


const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',router);

http.createServer(app).listen(process.env.PORT || 80);