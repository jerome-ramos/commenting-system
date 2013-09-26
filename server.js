var mongoose = require('mongoose');

var express = require('express');

var expressApp = express();

var documentSchema = new mongoose.Schema({
	upvotes : Number,
	author : String,
	time_elapsed : { type: Date},
	message : String
});

var commentModel = mongoose.model('commentscollection', documentSchema);

// Setup CORS related headers
var CORSSettings = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
	// deal with OPTIONS method during a preflight request
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
}


expressApp.configure(function () {

	mongoose.connect('mongodb://localhost:27017/test');
	mongoose.connection.once('open', function () {
		console.log('MongoDB connection opened.');
	});
	expressApp.use(express.bodyParser());
	expressApp.use(CORSSettings);
	expressApp.listen(9090);

});

expressApp.get('/comments', function (request, response) {
	commentModel.find({}, function (err, documents) {
		response.send(200, documents);
	});
});

expressApp.post('/comments', function (request, response) {
	commentModel.create(request.body, function (err, documents) {
		response.send(200, documents);
	});
});

expressApp.delete('/comments/:id', function (request, response) {
	commentModel.findByIdAndRemove(request.params.id, function (err, documents) {
		response.send(200, documents);
	});
});

expressApp.put('/comments/:id', function (request, response) {
	var documentAttributes = {
		field_value : request.body.field_value
	}
	commentModel.findByIdAndUpdate(request.params.id, documentAttributes, function (err, documents) {
		response.send(200, documents);
	});
});
