var express = require('express');
var db = require('../models');
var router = express.Router();

// SETS PROJECTS PAGE TO LIST OF PROJECTS
router.get('/', function(req, res) {
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


// async.series([fn1, fn3, fn2], function(err, results){
//      //waits for ^ to execute, in order specified, then does this:
//      console.log("done with all");
//      console.log(results);
// });



// POST /projects - create a new project
router.post('/', function(req, res) {
  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployedLink: req.body.deployedLink,
    description: req.body.description
  }).then(function(project) {
    if(req.body.categories){
      var categories = req.body.categories.split(",");
      for (var i = 0; i < categories.length; i++){
        db.category.findOrCreate({
          where: {name: categories[i]}
        }).spread(function(category, wasCreated){
          if(category){
            project.addCategory(category);
          } // end of if category
        }); // end of spread
      } // end of for loop
    } // end of if categories
  }).then(function() {
    res.redirect('/');
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /projects/new - display form for creating a new project
router.get('/new', function(req, res) {
  res.render('projects/new');
});

// GET /projects/:id - display a specific project
router.get('/:id', function(req, res) {
  db.project.find({
    include: [db.category],
    where: { id: req.params.id }
  })
  .then(function(project) {
    if (!project) throw Error();
    res.render('projects/show', { project: project });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});


//DELETE PROJECT
router.get("/delete/:id", function(req, res){
  console.log('inside delete route');
  db.project.destroy({
    where: { id: req.params.id }
  }).then(function(){
    //res.send("Project was destroyed"); 
    res.redirect("/");
  }).catch(function(err){
    console.log(err);
    res.send("oops, server error");
  });
});







module.exports = router;
