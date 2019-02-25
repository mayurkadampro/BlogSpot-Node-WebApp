let express = require('express'),
    app = express(),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    BlogPost = require('./models/blogpost'),
	index = require('./routes/index'),
	passport = require('passport');
	

require('./passport')(passport)
let port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/animal_blog');


var auth = require('./routes/auth')(passport);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
  secret: 'thesecret',
  saveUninitialized: false,
  resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', index);
app.use('/auth', auth);

app.set('view engine', 'ejs');



app.listen(port, function() {
  console.log(`Your server has started on PORT ${port}.`);
});
