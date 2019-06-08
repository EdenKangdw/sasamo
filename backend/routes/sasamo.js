var express = require('express');
var router = express.Router();
var movies = require('../movies.json');

var mysql_dbc = require('../model/db/db_conn')();
var connection = mysql_dbc.init();

// model 

function resModel(){
    return{
        success : Boolean,
        error : String,
        data : String
    }
}

function userModel(userVal, Boolean) {
    return {
        id: userVal.ssm_id ? userVal.ssm_id : "fail",
        pw: userVal.ssm_pw ? userVal.ssm_pw : "fail",
        group: userVal.ssm_group ? userVal.ssm_group : 'none',
        name: userVal.ssm_name ? userVal.ssm_name : 'none',
        check : userVal.chk_isToday ? userVal.chk_isToday : 'n',
        ok: Boolean ? Boolean : false
    };
}

function checkModel(userVal, eventVal){
    return {
        userSeq: userVal.ssm_seq ? userVal.ssm_seq : "n",
        username : userVal.ssm_name ? userVal.ssm_name : "n",
        eventSeq : eventVal.evt_seq ? eventVal.evt_seq : "n",
        eventName : eventVal.evt_name ? eventVal.evt_name : "n",
        today : eventVal.evt_today ? eventVal.evt_today : "n" 
    }
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
                var user = userModel(result[0], true)
                console.log('success', user)
                res.send(user)
    
            } else {
                var user = userModel(true, false)
                res.send(user)
                console.log('fail', user)
    
            }  
        } else{
            var user = userModel(true, false)
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
        var data = resModel()
        if(err) {
            console.log(query, err) 
            throw err 
        }else {
            console.log(typeof result, result.length, result)
            console.log("insert success")
            data.success = true
            res.send(data)
        }

    })
    

})

function updateTeam(group, id) {
    var query = `update ssm_member set ssm_group=${group} where ssm_id='${id}'`
    connection.query(query, function(err, result){
        if(err) {
            console.log(err)
            throw err
        } else {
            console.log('updateTeam : complete', query)
            return true
        }
    })

}


function enrollEvent(evt){
    // (서버)이벤트등록 : 오늘의 이벤트로 새로운 이벤트를 추가하여 출석체크 할 수 있도록 함, 식별자는 isToday = y,n
    var query = `insert into ssm_event(evt_name, evt_date, evt_kind, evt_today)` 
        query += `values('${evt.evt_name}', now(), '${evt.evt_kind}', 'y')`
        console.log('insert: todayEvent', query)
        connection.query(query, function(err, result){
            if(err) {
                console.log(err)
                throw err
            } else {
                console.log('insert: today event success', query)
            }
        }) 
}
// 오늘의 이벤트 정보 가져오기 
function getEventToday(userVal){
    var query = `select * from ssm_event where evt_today = 'y'`
    return new Promise(function(resolve, reject){
        connection.query(query, function(err, result){
            if(err){
                console.log(err)
                reject(new Error(err))
                throw err
            } else {
                data = checkModel(userVal, result[0] )
                console.log("오늘의 이벤트: ", data)
                resolve(data)
            }
        })
    })
    
}

router.post('/today', function(req, res){
    var user = req.body.user
    var result = resModel()
    getEventToday(user).then(function(data){
        result.success = true
        result.data = data
        res.send(result)
    }).catch(function(err){
        result.error = err
        console.log(result)
    })
})


router.post('/check', function(req, res){
    // (클라이언트)사역신청 & 출석체크 : 이미 지정된 이벤트에 대해 insert로 사역신청, isToday가 있을 경우 update로 출석체크
    var userSeq = req.body.ssm_seq
    var userName = req.body.ssm_name
    var evtSeq = req.body.evt_seq
    var evtName = req.body.evt_name
    var check = req.body.chk_isToday

    var query = `insert into ssm_check(ssm_seq, ssm_name, evt_seq, evt_name, chk_check, chk_isToday)` 
        query += ` values(${userSeq}, '${userName}', ${evtSeq}, '${evtName}', 'n', 'y')`

        if( check === 'y'){
            var checkQuery = `update ssm_check set chk_check = 'y' where ssm_seq = '${userSeq}' `
            console.log('출석체크 1 : ', checkQuery)
            connection.query(checkQuery, function(err){
                var data = resModel()
                if(err){
                    console.log(err)
                    data.error = err
                    res.send(data)
                    throw err
                } else{
                    console.log('출석체크 2 : 성공')
                    data.success = true
                    res.send(data)
                }
            })
        } else{
            // check값이 없음 : 사역신청의 경우 
            connection.query(query, function(err){
                var data = resModel()
                if(err) {
                    console.log(err)
                    data.error = err
                    res.send(data)
                    throw err
                } else {
                    console.log('insert: 출석체크 완료')
                    data.success = true
                    res.send(data)
                }
            })

        }

})

router.post('/cancelCheck', function(req, res){
    // 사역신청 취소하기
    var userSeq = req.body.ssm_seq
    var event = req.body.evt_seq
    var check = req.body.chk_isToday
    
    var query = `update ssm_check set chk_isToday = 'n', updt= now() where evt_seq='${event}' and ssm_seq = '${userSeq}'  `

    if(check == 'y'){
        var checkQuery = `update ssm_check set chk_check = 'n', UPDT = now() where evt_seq='${event}' and ssm_seq = '${userSeq}' `
        console.log('출석체크 취소 1: ', checkQuery)
        connection.query(checkQuery, function(err, result){
            var data = resModel()
            if(err){
                data.error = err
                console.log(err)
                res.send(data)
                throw err
            } else {
                data.success = true,
                console.log('출석체크 취소 완료')
                res.send(data)
            }
        })
    } else {
        console.log('사역신청 취소 1 :', query)
        connection.query(query, function(err, result){
        var data = resModel()
        if(err){
            console.log(err)
            data.error = err
            res.send(data)
            throw err
        } else {
            console.log('사역신청 취소 2: 성공')
            data.success = true
            res.send(data)
        }
    })
    }
})

router.post('/group', function(req, res){
    // today에 저장된 count값을 가져와 %로 계산해서 팀 배정 
    var id = req.body.ssm_id
    var groupCnt = req.body.group
    var query = `select * from ssm_today`
    console.log('makeGroup :', query)
    connection.query(query, function(err, result){
        if(err){
            console.log(err)
            throw err
        } else {
            var group = teamModel(result[0].tdy_count, groupCnt)
            console.log('당신은 ', group, '입니다')        
            updateTeam(group.team, id)
            console.log('팀 배정 완료') 
            res.send(success())    
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