var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var secretObj = require('../config/jwt')

var mysql_dbc = require('../model/db/db_conn')();
var connection = mysql_dbc.init();

// model 

function resModel() {
    return {
        success: Boolean,
        error: String,
        data: String
    }
}

function userModel(userVal, checkStatus, Boolean) {
    return new Promise((resolve, reject) => {
    let data = {
        id: userVal.ssm_id ? userVal.ssm_id : "fail",
        pw: userVal.ssm_pw ? userVal.ssm_pw : "fail",
        ssm_seq: userVal.ssm_seq ? userVal.ssm_seq : "fail",
        ssm_group: userVal.ssm_group ? userVal.ssm_group : 'none',
        ssm_name: userVal.ssm_name ? userVal.ssm_name : 'none',
        isTodayApply: checkStatus.chk_isApply ? checkStatus.chk_isApply : 'none',
        istodayCheck: checkStatus.chk_isCheck ? checkStatus.chk_isCheck : 'none',
        leader: userVal.ssm_tmldr ? userVal.ssm_tmldr : "n",
        ok: Boolean ? Boolean : false
    };
    resolve(data)
    
}) 
}

function checkModel(userVal, eventVal) {
    return new Promise(function (resolve, reject) {
        let data = {
            ssm_seq: userVal.ssm_seq ? userVal.ssm_seq : "n",
            ssm_name: userVal.ssm_name ? userVal.ssm_name : "n",
            evt_seq: eventVal.evt_seq ? eventVal.evt_seq : "n",
            evt_name: eventVal.evt_name ? eventVal.evt_name : "n",
            isTodayApply: "n",
            istodayCheck: "n"
        }
        resolve(data)
    })
}






function teamModel(count, group) {
    return {
        team: count % group ? count % group : 0
    };
}

// 회원의 상태값 가져오는 함수 
function statusModel(todayModel) {
    var query = `select * from ssm_check where ssm_seq=${todayModel.ssm_seq} and evt_seq=${todayModel.evt_seq}`
    return new Promise((resolve, reject) => {
       connection.query(query, function (err, result) {
            if (err) {
                console.log('statusModel Error: ', err)
                reject(err)
                throw err
            } else {
                let data = result[0]
                console.log('Status :', data)
                resolve(data)
            }
        })
    }) 
}


// router
// 토큰값을 userModel로 변경하여 처리하기 

// 로그인해서 token 받기 
router.post('/login', function (req, res) {
    var id = req.body.id
    var pw = req.body.pw
    var stmt = `select * from ssm_member where ssm_id='${id}'`;
    console.log(`login ${id} and ${pw}`)
    console.log(typeof id)
    connection.query(stmt, function (err, result) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log(typeof result, result.length, result)
            console.log('user DATA: ', result[0])
            if (result[0]) {
                if (id === result[0].ssm_id && pw === result[0].ssm_pw) {
                    // 정상적으로 로그인하는 경우
                    const userInfo = result[0]
                    // 로그인에 쓰일 토큰을 생성한다 
                    var token = jwt.sign({ data: userInfo }, secretObj.secret, { expiresIn: '5m' })
                    console.log("CREATE TOKEN :", token)
                    res.send(token)
                } else {
                    // 로그인 정보가 달라 실패한 경우
                    res.send("fail")
                }
            }
        }
    })
})

router.get('/getUserInfo', (req, res) => {
    // 토큰이 있는지 확인 
    let token = req.headers['access-token'] || req.query.token
    let decoded = jwt.decode(token, secretObj.secret)

    console.log("request Token :", token)
    console.log("DECODED INFO", decoded)
    if (decoded) {
        // 토큰이 있을경우 접속허가 
        getEventToday(decoded)
            .then(function (todayModel) {
                console.log('dddddddd',todayModel)
                statusModel(todayModel)
                .then((checkStatus) => {

                    console.log('this is status:', checkStatus)
                    if (checkStatus.chk_isApply != 'n') {
                        // 사역 신청을 한 경우
                        userModel(decoded.data, checkStatus, true)
                        .then((user) => {
                            console.log('success, today : Ok ', user)
                            res.send(user)
                        })
                    } else {
                        // 사역신청을 안한 경우
                        userModel(decoded.data, checkStatus, true)
                        .then((user) => {
                            console.log('success, today : NO ', user)
                            res.send(user)
                        })
                    }
                })
                .catch((err) => {
                    console.log('ERROR: ', err)
                })
            })
    } else {
        alert("시간이 만료되어 로그인이 해제되었습니다. 다시 로그인해주세요.")
        res.send(false)
    }


})


var count = 0
router.post('/count', function (req, res) {
    // today 테이블에 count 값을 증가시킨다. 
    count++
    var query = `update ssm_today set tdy_count=${count}`
    connection.query(query, function (err, result) {
        var data = resModel()
        if (err) {
            console.log(query, err)
            throw err
        } else {
            console.log(typeof result, result.length, result)
            console.log("insert success")
            data.success = true
            res.send(data)
        }

    })


})

function updateTeam(group, id) {
    var query = `update ssm_member set ssm_group=${group} where ssm_id='${id}'`
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err)
            throw err
        } else {
            console.log('updateTeam : complete', query)
            return true
        }
    })

}


function enrollEvent(evt) {
    // (서버)이벤트등록 : 오늘의 이벤트로 새로운 이벤트를 추가하여 출석체크 할 수 있도록 함, 식별자는 isToday = y,n
    var query = `insert into ssm_event(evt_name, evt_date, evt_kind, evt_today)`
    query += `values('${evt.evt_name}', now(), '${evt.evt_kind}', 'y')`
    console.log('insert: todayEvent', query)
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err)
            throw err
        } else {
            console.log('insert: today event success', query)
        }
    })
}
// 오늘의 이벤트 정보 가져오기 
function getEventToday(userVal) {
    // 오늘의 이벤트 정보를 가져온다 
    var query = `select * from ssm_event where evt_today = 'y'`
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, result) {
            if (err) {
                console.log(err)
                reject(new Error(err))
                throw err
            } else {
                console.log("TODAY EVENT : ", result[0])
                console.log('USER : ', userVal)
                // 체크모델 만들기  
                checkModel(userVal.data, result[0])
                    .then(function (todayModel) {
                        console.log("오늘의 이벤트: ", todayModel)
                        resolve(todayModel)
                    })
            }
        })
    })
}

function checkToday(userSeq, evtSeq) {
    // 특정 유저가 사역신청을 했는지 여부를 받아오는 함수
    var query = `select * from ssm_check where ssm_seq='${userSeq}'`
    query += `and evt_seq = '${evtSeq}'`
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, result) {
            if (err) {
                console.log(err)
                reject(new Error(err))
                throw err
            } else {
                var data = checkModel(userVal, result[0])
                console.log("오늘의 이벤트: ", data)
                resolve(data)
            }
        })

    }

    )
}

router.get('/today', function (req, res) {
    let token = req.headers['access-token'] || req.query.token
    let decoded = jwt.decode(token, secretObj.secret)

    if (decoded != null) {
        var user = decoded.data
        console.log('vue-user', user)
        var result = resModel()
        getEventToday(user).then(function (data) {
            result.success = true
            result.data = data
            console.log('todayData 1:', result)
            res.send(result)
        }).catch(function (err) {
            result.error = err
            console.log(result)
        })

    }

})

// 기존 신청 여부 확인
function getApplyCheckModel(userSeq, evtSeq) {
    return new Promise(function (resolve, reject) {
        var query = `select * from ssm_check where ssm_seq = '${userSeq}' and evt_seq = '${evtSeq}'`
        connection.query(query, function (err, res) {
            var result = resModel()
            if (err) {
                result.error = err
                reject(new Error(err))
            } else if (res.length != 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })


}


router.post('/check', function (req, res) {
    // (클라이언트)사역신청 & 출석체크 : 이미 지정된 이벤트에 대해 insert로 사역신청, isToday가 있을 경우 update로 출석체크
    let token = req.headers['access-token'] || req.query.token
    let decoded = jwt.decode(token, secretObj.secret)

    console.log('asdjfklasjdfk', token)
    console.log('CHECK USER :', decoded.data)

    if (decoded != null) {
        let ssm_seq = decoded.data.ssm_seq
        let ssm_name = decoded.data.ssm_name
        let ssm_team = decoded.data.ssm_team
        let isTodayCheck = req.body.isTodayCheck

        console.log('qQQqqqQQQQQQQQQQQ :', ssm_seq)
        var today = 'd'
        console.log('DATA :', decoded.data)

        getEventToday(decoded)
            .then(function (result) {
                today = result
                console.log('TOOOOODAY', today)

                // 기존 신청 이력이 있는지 확인하기, 없으면 사역신청, 있으면 출석체크 
                getApplyCheckModel(ssm_seq, today.evt_seq).then(function (checkModel) {
                    if (checkModel && isTodayCheck) {
                        // 출석체크 
                        var checkQuery = `update ssm_check set chk_isCheck = 'y' where ssm_seq = '${ssm_seq}' `
                        checkQuery += `and evt_seq = ${today.evt_seq} and ssm_team = ${ssm_team}`
                        console.log('출석체크 1 : ', checkQuery)
                        connection.query(checkQuery, function (err) {
                            var data = resModel()
                            if (err) {
                                console.log(err)
                                data.error = err
                                res.send(data)
                                throw err
                            } else {
                                console.log('출석체크 2 : 성공')
                                data.success = true
                                res.send(data)
                            }
                        })
                    } else {
                        // 사역신청 
                        var query = `insert into ssm_check(ssm_seq, ssm_name, ssm_team, evt_seq, evt_name, chk_isApply, chk_isCheck)`
                        query += ` values(${ssm_seq}, '${ssm_name}', ${ssm_team} ,${today.evt_seq}, '${today.evt_name}', 'y', 'n')`
                        console.log('insert query', query)
                        connection.query(query, function (err) {
                            var data = resModel()
                            if (err) {
                                console.log(err)
                                data.error = err
                                res.send(data)
                                throw err
                            } else {
                                console.log('insert: 사역신청 완료')
                                data.success = true
                                res.send(data)
                            }
                        })
                    }
                })
            })
            .catch(function (err) {
                res.send(err)
                console.log(err)
            })

    } else {
        console.log('errpr')
    }


})


router.post('/cancelCheck', function (req, res) {
    // 사역신청 취소하기
    let token = req.headers['access-token'] || req.body.token
    let decoded = jwt.decode(token, secretObj.secret)
    console.log('CANCEL TOKEN', token)
    let today = ''

    if (decoded != null) {
        let isTodayCheck = req.body.isTodayCheck
        console.log("취소토큰",)
        getEventToday(decoded)
            .then(result => {
                today = result
                console.log('TODAY ::::', today)

                var ssm_seq = today.ssm_seq
                var evt_seq = today.evt_seq

                console.log("CCCCCCCCHK:", isTodayCheck)
                // 체크안한 경우    
                if (isTodayCheck) {
                    var checkQuery = `update ssm_check set chk_isCheck = 'n', UPDT = now() where evt_seq='${evt_seq}' and ssm_seq = '${ssm_seq}' `
                    console.log('출석체크 취소 1: ', checkQuery)
                    connection.query(checkQuery, function (err, result) {
                        var data = resModel()
                        if (err) {
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
                    // 체크한 경우
                } else {
                    var query = `update ssm_check set chk_isApply = 'n', updt = now() where evt_seq='${evt_seq}' and ssm_seq = '${ssm_seq}'  `
                    console.log('사역신청 취소 1 :', query)
                    connection.query(query, function (err, result) {
                        var data = resModel()
                        if (err) {
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


    } else {
        var data = resModel()
        data.error = 'we cannot find correct access token. Please check your token again'
        data.success = false
        res.send(data)

    }


})

router.post('/group', function (req, res) {
    // today에 저장된 count값을 가져와 %로 계산해서 팀 배정 
    var id = req.body.ssm_id
    var groupCnt = req.body.group
    var query = `select * from ssm_today`
    console.log('makeGroup :', query)
    connection.query(query, function (err, result) {
        if (err) {
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

router.post('/signup', function (req, res) {
    console.log('REQ : data', req.body)
    var query = `insert into ssm_member(ssm_name, ssm_id, ssm_pw, ssm_phone, ssm_gen, ssm_type, ssm_team) values `
    query += `('${req.body.ssm_name}','${req.body.ssm_id}','${req.body.ssm_pw}','${req.body.ssm_phone}',`
    query += `'${req.body.ssm_gen}','${req.body.ssm_type}','${req.body.ssm_team}')`;
    console.log(query)
    connection.query(query, function (err, result) {
        console.log('insert1')
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('success insert')
        }
    })


});

// 팀배정용_사역신청자 리스트 조회
router.get('/team/applied', (req, res) => {
    let token = req.headers['access-token'] || req.query.token
    let decoded = jwt.decode(token, secretObj.secret)

    if (decoded) {
        let ssm_team = decoded.data.ssm_team
        const query = `select * from ssm_member where ssm_team =${ssm_team}`
        connection.query(query, function (err, result) {
            var data = resModel()
            if (err) {
                console.log(err)
                data.success = false
                data.error = err
                throw err
            } else {
                data.success = true
                data.data = result
                res.send(data)
            }
        })


    }
    else {
        var data = resModel()
        data.error = 'ERROR: we couldnt get token'
        res.send(data)

    }
})







module.exports = router; 