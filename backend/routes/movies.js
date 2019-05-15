var express = require('express');
var router = express.Router();
var movies = require('../movies.json');

router.get('/', function (req, res, next) {
  res.send(movies)
  console.log("영화목록리스팅")
});

router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id, 10)
  var movie = movies.filter(function (movie) {
    return movie.id === id
  });
  console.log('영화디테일' + id);
  res.send(movie)
});

module.exports = router;