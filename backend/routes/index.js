var express = require('express');
var path = require('path');
var router = express.Router();

var mysql_dbc = require('../model/db/db_conn')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

router.get('/mysql/test', function (req, res) {
  var stmt = 'select *from ....';
  connection.query(stmt, function (err, result) {
    
  })
});

module.exports = router;
