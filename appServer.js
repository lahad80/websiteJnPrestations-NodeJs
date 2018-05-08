
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');

var fs = require('fs');
//var banque = require('./banque');

/*
function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

*/


// Si on lance l'application Angular.js avec grunt serve
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});



app.use(bodyParser.json()); // pour parser du JSON


app.get('/listAllContacts', function(req, res) {
    fs.readFile("json/usersFile.json", 'utf8', function(err, data){
		
		res.end(data); // send data to client
	});
});



function Contact(date, familyName, firstName, phoneNumber, email, status, purpose, message, position){
	this.date = date;
	this.familyName = familyName;
	this.firstName = firstName;
	this.phoneNumber = phoneNumber;
	this.email = email;
	this.status = status;
	this.purpose = purpose;
	this.message = message;
	this.position = position;
}

app.post('/newContact', function(req, res){
	var toDay = new Date();
	var shortDate = toDay.getDate() + '/' + (toDay.getMonth()+1) + '/' + toDay.getFullYear();
	/*var user = req.body.theUser;
	  var contact = new Contact(shortDate, user.familyName, user.firstName, user.phoneNumber, user.email, user.status, user.purpose, user.message );
	*/
	
	fs.readFile("json/usersFile.json", 'utf8', function(err, data){
		data = JSON.parse(data);          // convert json to javascript
		var contact = new Contact(shortDate, req.body.familyName, req.body.firstName, req.body.phoneNumber, req.body.email, req.body.status, req.body.purpose, req.body.message, data["count"]++);	
		data["contacts"].push(contact);
		data = JSON.stringify(data);    // convert javascript to json
		fs.writeFile("json/usersFile.json", data ,'utf8', function(err, data){
			
		});
		res.end(data);
	});
});


app.get('/credentials', function(req, res){
	fs.readFile('json/adminFile.json','utf8', function(err, data){
		res.end(data);
	});
});


app.delete('/deleteContact/:id', function(req, res){
	fs.readFile("json/usersFile.json", 'utf8', function(err, data){
		data = JSON.parse(data); 
		var i = 0,found = false;
		while(i < data["contacts"].length &&  !found){
			if(data["contacts"][i].position === parseInt(req.params.id)){
				data["contacts"].splice(i,1);
				found = true;
			}
			i++;
		}
		data = JSON.stringify(data);   
		fs.writeFile("json/usersFile.json", data ,'utf8', function(err, data){
			
		});
	
		res.end(data);
	});
	
});

server.listen(3000);