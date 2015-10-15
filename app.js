var port = 3030;

/////////
var express = require('express');
var bodyParser = require('body-parser');
var monk = require('monk');

var db = monk('localhost:27017/QuranMedia');
var msgs = {};
var app = express();
var jsonParser = bodyParser.json();


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});

app.use('/', express.static(__dirname + '/public'));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

/*
app.get("/", function(req,res,next){
	//console.log("/");
	res.send({
        //status: "200",
        //msg: "OK",
        //timestamp: new Date().getTime(),
        //description:"Simple Server."
        String: "MSG",
    });
});
*/
app.get("/getAyaat/:id", function(req,res,next){
  var collection = db.get('ayatTable');
  collection.find({ SurahNo: req.params.id },{},function(e,docs){
    res.send(docs);
  });
});

app.get("/getSurahNames", function(req,res,next){
  var collection = db.get('ayatTable');
  collection.distinct( "SurahName" ,{},function(e,docs){
    res.send(docs);
  });
});

app.post("/user/*",jsonParser,function(req,res){
 // Set our collection
 var collection = db.get('messagescollection');

    // Submit to the DB
    collection.insert(
      req.body, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
          }
          else {
            res.sendStatus(200);
          }
        });
  });



var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});















