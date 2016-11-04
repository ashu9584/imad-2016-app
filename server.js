var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser'); 
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

var config = {
    user : 'ashu9584',
    database : 'ashu9584',
    host:'db.imad.hasura-app.io',
    port :'5432',
    password: process.env.DB_PASSWORD  
};

var pool = new pg.Pool(config);
function quiztemplate(ques)
{
    var temp = `
    <html>
    <head>
  <meta charset="UTF-8">
  <title>Dynamic JS Quiz</title>
    <link rel="stylesheet" href="ui/quiz.css">
</head>
<body>
<html>
	<head>
		<title>Dynamic Quiz Project</title>
	</head>
	<body>
		<div id="container">
			<div id="title">
				<h1>Quiz</h1>
			</div>
   			<br/>
  			<div id="quiz"></div>
    		<div class="button" id="next"><a href="#">Next</a></div>
    		<div class="button" id="prev"><a href="#">Prev</a></div>
    		<div class="button" id="start"> <a href="#">Start Over</a></div>
    		<!-- <button class="" id="next">Next</a></button>
    		<button class="" id="prev">Prev</a></button>
    		<button class="" id="start"> Start Over</a></button> -->
    	</div>

		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	</body>
</html>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

      <script src="js/index.js"></script>

</body>
</html> `;

    return temp;
}


app.get('/takequiz', function (req, res) {
  res.send(quiztemplate());
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/dbtest', function (req, res) {
  res.send(" This is a test message");
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
