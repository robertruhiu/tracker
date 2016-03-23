// server.js

// DEPENDENCIES AND SETUP
// ===============================================

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  port = Number(process.env.PORT || 8080);

// To read POST data, we use the body-parser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// DATABASE
// ===============================================

// Setup the database.
var Datastore = require('nedb');
var db = new Datastore({
  filename: 'goals.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

// ROUTES
// ===============================================

// GET all goals
// (accessed at GET http://localhost:8080/goals)
app.get('/goals', function(req, res) {
  db.find({}).sort({
    updatedAt: -1
  }).exec(function(err, result) {
    if (err) console.log(err);
    res.json(result);
  });
});

// POST a new goal
// (accessed at POST http://localhost:8080/goals)
app.post('/goals', function(req, res) {
  var goal = {
    description: req.body.description,
  };
  db.insert(goal, function(err, goal) {
    if (err) console.log(err);
    res.redirect('/');
  });
});

// DELETE a goal
// (accessed at DELETE http://localhost:8080/goals/goal_id)
app.delete('/goals/:id', function(req, res) {
  var goal_id = req.params.id;
  db.remove({
    _id: goal_id
  }, {}, function(err, goal) {
    if (err) console.log(err);
    res.redirect('/');
  });
});


// START THE SERVER
// ===============================================

app.listen(port, function() {
  console.log('Listening on port ' + port);
});