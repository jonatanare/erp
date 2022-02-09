const express = require('express');
const app = express();
const cors = require("cors");
const routes = require('./routes/routes');
const path = require('path');
const morgan = require('morgan');

// Settings
require('dotenv').config({ 
    path: `./${process.env.NODE_ENV}.env`
});
app.set('port', process.env.PORT | 3000);

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));
app.use('/files', express.static(path.join(__dirname, "./files")));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// Routes
app.use('/api', routes);

// Start the server
app.listen(app.get('port'), () =>{
  console.log(`Servidor en el puerto ${app.get('port')}`);
});