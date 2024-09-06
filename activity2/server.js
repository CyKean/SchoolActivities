const express = require('express')
const session = require('express-session');
const {create} = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const getRoutes = require('./router/get')
const postRoutes = require('./router/post')

const app = express()

app.use(session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
  }));

const hbs = create({ extname: '.hbs',defaultLayout: false});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
app.use('/',getRoutes); 
app.use('/',postRoutes); 
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})