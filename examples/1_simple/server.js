
var express = require('express');
var bodyParser = require('body-parser');

// initialise data
var list = [
	{id: 1, name: 'Apple', color: 'Red'},
	{id: 2, name: 'Orange', color: 'Orange'},
	{id: 3, name: 'Banana', color: 'Yellow'}
];
var newId = 4;

// create app
var app = express();

// setup index route
app.use(express.static(__dirname));
app.get('/', function(req, res) {
  res.render('/index.html');
});

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.json());

// setup entry points
app.get('/api/fruit', getList);
app.put('/api/fruit', createItem);
app.post('/api/fruit/:id', updateItem);
app.delete('/api/fruit/:id', deleteItem);

// request list
function getList(req, res) {
	// create artificial loading time
	setTimeout(function() {
		// return the list
		res.send(list);
	}, 3000);
}

// add an entry to the list
function createItem(req, res) {
	// get new item and set the id
	var newEntry = req.body;
	newEntry.id = newId;
	newId++;

	// update server data
	list.push(newEntry);

	// inform the client
	res.send(newEntry);
}

// add an entry to the list
function updateItem(req, res) {
	var id = req.params.id;
	var newEntry = req.body;

	// update server data
	list.splice(getPosition(list, id), 1, newEntry);

	// inform the client
	res.send(newEntry);
}

// add an entry to the list
function deleteItem(req, res) {
	var id = req.params.id;

	// update server data
	list.splice(getPosition(list, id), 1);

	// inform the client
	res.send(true);
}

// start server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at http://%s:%s', host, port);
});

function getPosition(array, id) {
	return array.indexOf(array.filter(function(x) {
		return x.id === id;
	}));
}
