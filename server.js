var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pg = require('pg');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(morgan('combined'));
function hash (input,salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 1000, 512, 'sha512');
    return ["pbkdf2", "1000", salt, hashed.toString('hex')].join('$');
}
  var hasher = function(str) {
    var hash = 5381;
      var i= str.length;
  while(i)
    hash = (hash * 33) ^ str.charCodeAt(--i);
  return hash >>> 0;
};
var config = {
    user : 'ashu9584',
    database : 'ashu9584',
    host:'db.imad.hasura-app.io',
    port :'5432',
    password: process.env.DB_PASSWORD  
};
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
var pool = new pg.Pool(config);
function quiztemplate(ques,user,quiz)
{   
    var temp = `
    <!DOCTYPE html>
    <html>
    <head>
  <meta charset="UTF-8">
  <title>Dynamic JS Quiz</title>
    <link rel="stylesheet" href="/ui/quiz.css">
</head>
<body>
<a href="/"><-Home </a>
<html>
	<head>
		<title>Dynamic Quiz Project</title>
	</head>
	<body>
		<div id="container">
			<div id="title">
				<h1>${quiz[0].topicname}  Quiz</h1>
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
		<script src="/ui/quiz.js"></script>
	</body>
</html>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
      <script>(function() {
      var questions =[];
      var hasher = function(str) {
    var hash = 5381;
      var i= str.length;
  while(i)
    hash = (hash * 33) ^ str.charCodeAt(--i);
  return hash >>> 0;
};`;
  for(var i=0;i<ques.length;i++)
  { 
    temp = temp + `
    questions.push({
      question : '${ques[i].question}',
    A: "${ques[i].A}",
    B: "${ques[i].B}",
    C: "${ques[i].C}",
    D: "${ques[i].D}",
    id: ${ques[i].id}
  });`
  }
  temp = temp + `
  var questionCounter = 0; //Tracks question number
  var selections = [],ids=[]; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  // Display initial question
  displayNext();
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  // Creates and returns the div that contains the questions and
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    return qElement;
  }
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    //for (var i = 0; i < 4; i++) {
      item = $('<li>');
      input = '<input id="choice" type="radio" name="answer" value=' + 1 + ' />';
      input += questions[index].A;
      item.append(input);
      radioList.append(item);
      item = $('<li>');
      input = '<input id="choice" type="radio" name="answer" value=' + 2 + ' />';
      input += questions[index].B;
      item.append(input);
      radioList.append(item);
      item = $('<li>');
      input = '<input id="choice" type="radio" name="answer" value=' + 3 + ' />';
      input += questions[index].C;
      item.append(input);
      radioList.append(item);
      item = $('<li>');
      input = '<input id="choice" type="radio" name="answer" value=' + 4 + ' />';
      input += questions[index].D;
      item.append(input);
      radioList.append(item);
    return radioList;
  }
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
    ids[questionCounter]=+questions[questionCounter].id;
  }
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          $('#prev').hide();
          $('#next').show();
        }
      }else {
      var scoreElem = displayScore(user);
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }
  // Computes score and returns a paragraph element to be displayed
  function displayScore(username) {
    var score = $('<p>',{id: 'question'});
    var numCorrect = 0;`;
    for (i = 0; i < ques.length; i++) {
        ques[i].correctAnswer = hasher(ques[i].correctAnswer.toString());
    }
    for (i = 0; i < ques.length; i++) {
      temp=temp+`
      if (selections[${i}] === 1)
      if (hasher(questions[${i}].A.toString()) === ${ques[i].correctAnswer}) 
        numCorrect++;
      if (selections[${i}] === 2)
      if (hasher(questions[${i}].B.toString()) === ${ques[i].correctAnswer}) 
        numCorrect++;
      if (selections[${i}] === 3)
      if (hasher(questions[${i}].C.toString()) === ${ques[i].correctAnswer}) 
        numCorrect++;
      if (selections[${i}] === 4)
      if (hasher(questions[${i}].D.toString()) === ${ques[i].correctAnswer}) 
        numCorrect++;
      
        console.log(selections[${i}])`;
    }
    temp = temp +`
    score.append(username +'  You got ' + numCorrect + ' questions out of ' +
                 questions.length + ' right!!!');
    
    return score;
}
})();</script>
</body>
</html> `;

    return temp;
}

app.post('/submit-score', function (req, res) {
   var select = req.body.selections;
 
   console.log('recieved submit request');
   res.send('jhfjfgjhj');
});
app.post('/create-user', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});
app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});
app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});
app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('<html><title>Not Logged in </title>You are not logged in, please <a href="/">click here</a> to login');
   }
});
app.get('/takequiz/:topic', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              //res.send(result.rows[0].username);    
            pool.query("SELECT * FROM questest WHERE topicid = $1 ORDER BY RANDOM() LIMIT 5",[req.params.topic],function (err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length === 0){
                res.status(404).send("The quiz is not found");
            }
            else{
                pool.query("SELECT * FROM topics WHERE topicid = $1",[req.params.topic],function (err2,result2){
                     if(err2){
                  res.status(500).send(err.toString());
                }
               else{
               if(result2.rows.length === 0){
                         res.status(404).send("<html>The quiz is not found. <a href="/">Click here</a> to return back to home<html>");
                  }
             else{
                var ques = result.rows;
                var quizname = result2.rows;
                res.send(quiztemplate(ques,req.session.auth,quizname));
               }
                 }
              });
            }
        }
    });
               
           }
       });
   } else {
       res.status(400).send('<html><title>Not Logged in </title>You are not logged in, please <a href="/">click here</a> to login');
   }
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});