// server.js

// DEPENDENCIES
// ===============================================

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'), // Middleware to read POST data
  exphbs = require('express-handlebars');

// SETUP
// ===============================================

// Set the port number.
var   port = Number(process.env.PORT || 8080);

// Set up body-parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// Tell the app that the templating engine is Handlebars.
app.engine('handlebars',
  // Pass default configuration to express-handlebars module.
  exphbs({
    defaultLayout: 'main'
  }));

// Tell the app that the view engine is also Handlebars.
app.set('view engine', 'handlebars');

// DATABASE
// ===============================================

// Setup the database.
var Datastore = require('nedb');
var db = new Datastore({
  filename: 'goals.db', // Provide a path to the database file.
  autoload: true, // Automatically load the database.
  timestampData: true // Add and manage the fields createdAt and updatedAt.
});

// ROUTES
// ===============================================

// GET all goals.
// (Accessed at GET http://localhost:8080/goals)
app.get('/goals', function(req, res) {
  db.find({}).sort({
    updatedAt: -1
  }).exec(function(err, result) {
    if (err) console.log(err);
    res.json(result);
  });
});

// POST a new goal.
// (Accessed at POST http://localhost:8080/goals)
app.post('/goals', function(req, res) {
  var goal = {
    description: req.body.description,
  };
  db.insert(goal, function(err, goal) {
    if (err) console.log(err);
    res.redirect(201,'/');
  });
});


// GET a goal.
// (Accessed at GET http://localhost:8080/goals/goal_id)
app.get('/goals/:id', function(req, res) {
  var goal_id = req.params.id;
  db.find({
    _id: goal_id
  }, {}, function(err, result) {
    if (err) console.log(err);
    res.json(result);
  });
});

// DELETE a goal.
// (Accessed at DELETE http://localhost:8080/goals/goal_id)
app.delete('/goals/:id', function(req, res) {
  var goal_id = req.params.id;
  db.remove({
    _id: goal_id
  }, {}, function(err, goal) {
    if (err) console.log(err);
    res.sendStatus(200);
  });
});

// GET the home page
// (Accessed at GET http://localhost:8080/)
app.get('/', function(req, res) {
  db.find({}).sort({
    updatedAt: -1
  }).exec(function(err, result) {
    if (err) console.log(err);
    var obj = {
      goals: result,
      helpers: {
        formatCreatedAt: function() {
          return this.createdAt.toLocaleDateString();
        }
      }
    };
    res.render('index', obj);
  });
});

// START THE SERVER
// ===============================================

app.listen(port, function() {
  console.log('Listening on port ' + port);
});