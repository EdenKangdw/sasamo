var express = require('express');
var router = express.Router();
var movies = require('../movies.json');

var mysql_dbc = require('../model/db/db_conn')();
var connection = mysql_dbc.init();

// model 

function loginModel(userVal) {
    return {
        log: userVal.ssm_id,
        ok: true
    };
}

// router

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
    console.log('first')
  });

router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id, 10)
  var movie = movies.filter(function (movie) {
    return movie.id === id
  });
  res.send(movie)
});

router.post('/login', function(req, res) {
    var id = req.body.id
    var pw = req.body.pw
    var stmt = `select * from ssm_member where ssm_id='${id}'`;
    console.log(`login ${id} and ${pw}`)
    console.log(typeof id)
    console.log('sakdhfkasjdfkljsdf')
    connection.query(stmt, function (err, result) {
        console.log('1')
    if(err) {
        console.log(err)
        throw err;
    } else {
        console.log('2')
        console.log(typeof result, result.length, result)
        if(id === result[0].ssm_id && pw === result[0].ssm_pw){
            var user = loginModel(result[0])
            res.send(user)
        } else {
            console.log('4')
        }   
    }
      
    })
});





module.exports = router;