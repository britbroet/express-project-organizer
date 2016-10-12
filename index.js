var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static('public'));


//ROUTES

app.get('/', function(req, res) {
  db.project.findAll({
  	include: [db.category],
  	order: [['createdAt', 'DESC']]
	  }).then(function(projects) {
	    res.render('main/index', { projects: projects });
	  })
	  .catch(function(error) {
	    res.status(400).render('main/404');
	  });
});


// GET /categories/:id - displays all projects with certain category
app.get('/categories/:id', function(req, res){
  db.category.find({
    where: { id: req.params.id }
  })
  .then(function(category){
  	console.log('category name: ' + category.name);
    category.getProjects().then(function(projects){
      res.render('cats/byCategory', { categoryName: category.name, projects: projects }); //send it these paramaters
    }); //end of second then
  }); //end of first then
});

// GET /categories - displays all categories
app.get('/categories', function(req, res){
	db.category.findAll({ order: "name ASC"}).then(function(categories){
		res.render("cats/allCategories", { categories: categories});
	});
});






app.use('/projects', require('./controllers/projects'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
