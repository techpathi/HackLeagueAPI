const express = require('express');
const router = require('./src/routes/routing');
const myErrorLogger = require('./src/utilities/errroLogger')
const myRequestLogger = require('./src/utilities/requestLogger')

const port = 8000;
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(myRequestLogger);
app.use('/', router);
app.use(myErrorLogger);

app.listen(port);
console.log("Server listening in port " + port);