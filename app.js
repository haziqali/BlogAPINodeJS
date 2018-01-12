var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.json());


var dbPath = "mongodb://localhost/myblogapp";
db = mongoose.connect(dbPath, {
    useMongoClient: true
});

mongoose.connection.once('open', function () {
    console.log("database connection open success");
});

var Blog = require('./blogModel.js');
var blogModel = mongoose.model('Blog');


app.get('/', function (req, res) {
    res.send("this is blog app");
});

//get all blogs
app.get('/api/v1/blogs', function (req, res) {
    blogModel.find(function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (result.length === 0) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.send('There are no blogs present!');
                return;
            }
            res.send(result);
        }
    });
});

//create a blog
app.post('/api/v1/createBlog', function (request, res) {
    console.log(request.body);
    if (request.body.title === undefined || request.body.title === '') {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.send('Title for blog cannot be empty');
        return;
    }
    var newBlog = new blogModel({
        title: request.body.title,
        subTitle: request.body.subTitle,
        textBlog: request.body.textBlog
    });
    newBlog.tags = (request.body.tags != undefined && request.body.tags != null) ? request.body.tags.split(',') : '';
    newBlog.author = request.body.author;
    newBlog.save(function (error) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.send("Blog created with id : " + newBlog._id);
        }
    });
});


//get a particular blog from id
app.get('/api/v1/blogs/:id', function (req, res) {
    blogModel.findOne({
        '_id': req.params.id
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (result === undefined || result === null) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.send('Cannot find blog with that id');
                return;
            }
            res.send(result);
        }
    });
});


//update a blog
app.put('/api/v1/blogs/:id/edit', function (req, res) {

    var update = req.body;
    blogModel.findOneAndUpdate({
        '_id': req.params.id
    }, update, function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (result === undefined || result === null) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.send('Cannot edit blog with that id since it does not exist');
                return;
            }
            res.send("Blog updated!");
        }
    });
});


//delete a blog
app.post('/api/v1/blogs/:id/delete', function (req, res) {

    blogModel.remove({
        '_id': req.params.id
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (result.result.n===0) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.send('Cannot delete blog with that id since it does not exist');
                return;
            }
            res.send('Successfully deleted the blog!');
        }
    });
});

app.listen(3000, function(){
    console.log('listening on port 3000!')
});
