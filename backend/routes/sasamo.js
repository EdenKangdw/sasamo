var express = require('express');
var router = express.Router();
var movies = require('../movies.json');

var mysql_dbc = require('../model/db/db_conn')();
var connection = mysql_dbc.init();

// model 

function loginModel(userVal, Boolean) {
    return {
        id: userVal.ssm_id ? userVal.ssm_id : "fail",
        pw: userVal.ssm_pw ? userVal.ssm_pw : "fail",
        group: userVal.ssm_group ? userVal.ssm_group : 'none',
        name: userVal.ssm_name ? userVal.ssm_name : 'none',
        ok: Boolean ? Boolean : false
    };
}


function teamModel(count, group) {
    return {
        team: count % group ? count % group : 0
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
        if(result[0]){
            if(id === result[0].ssm_id && pw === result[0].ssm_pw){
                var user = loginModel(result[0], true)
                console.log('success', user)
                res.send(user)
    
            } else {
                var user = loginModel(true, false)
                res.send(user)
                console.log('fail', user)
    
            }  
        } else{
            var user = loginModel(true, false)
            res.send(user)
        }
         
    }
      
    })
});
var count = 0
router.post('/count', function(req, res){
    // today 테이블에 count 값을 증가시킨다. 
    count++
    var query = `update ssm_today set tdy_count=${count}`
    connection.query(query, function(err, result){
        if(err) {
            console.log(query, err) 
            throw err 
        }else {
            console.log(typeof result, result.length, result)
            console.log("insert success")
        }

    })
    

})



router.post('/group', function(req, res){
    // today에 저장된 count값을 가져와 %로 계산해서 팀 배정 
    var group = req.body.group
    var query = `select * from ssm_today`
    console.log('makeGroup :', query)
    connection.query(query, function(err, result){
        if(err){
            console.log(err)
            throw err
        } else {
            var team = teamModel(result[0].tdy_count, group)
            console.log('당신은 ', team, '입니다')
            res.send(team)  
        }
    })
})

router.post('/signup', function(req, res) {
    console.log('REQ : data', req.body)
    var query = `insert into ssm_member(ssm_name, ssm_id, ssm_pw, ssm_phone, ssm_isItrn, ssm_isHeal, ssm_isPrpt, ssm_isPstr, ssm_team) values `
        query += `('${req.body.ssm_name}','${req.body.ssm_id}','${req.body.ssm_pw}','${req.body.ssm_phone}',`
        query += `'${req.body.ssm_isItrn}','${req.body.ssm_isHeal}','${req.body.ssm_isPrpt}','${req.body.ssm_isPstr}','${req.body.ssm_team}')`;
    console.log(query)
    connection.query(query, function (err, result) {
        console.log('insert1')
        if(err){
            console.log(err)
            throw err;
        }else{
            console.log('success insert')   
        }
    })


});







module.exports = router;