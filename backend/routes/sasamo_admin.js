var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var secretObj = require('../config/jwt')

var mysql_dbc = require('../model/db/db_conn')();
var connection = mysql_dbc.init();

const resModel = () => {
	return {
		success: Boolean,
		error: String,
		data: String
	}
}
const loginModel = () => {
	return {
        success: Boolean,
		error: String,
        data: String,
        access : Boolean
	}
}


// 로그인 
router.post('/login', function (req, res) {
    var id = req.body.id
    var pw = req.body.pw
    var query = `select * from ssm_member where ssm_id='${id}'`;
    console.log(`login ${id} and ${pw}`)
    console.log(typeof id)
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log(typeof result, result.length, result)
            console.log('user DATA: ', result[0])
            if (result[0]) {
                let data = loginModel()
                if (id === result[0].ssm_id && pw === result[0].ssm_pw) {
                    if (result[0].ssm_level != "E") {
                        // 정상적으로 로그인하는 경우
                        const userInfo = result[0]
                        // 로그인에 쓰일 토큰을 생성한다 
                        var token = jwt.sign({ data: userInfo }, secretObj.secret, { expiresIn: '5m' })
                        console.log("CREATE TOKEN :", token)
                        data.data = token
                        data.success = true
                        data.access = true
                        res.send(data)

                    } else {
                        // 접근 권한이 없는 경우
                        data.success = false
                        data.access = false
                        data.error = "접근권한이 없습니다."
                        res.send(data)
                    }
                }
            } else {
                // 로그인 정보가 달라 실패한 경우
                data.success = false
                data.access = false
                data.error = "정상적인 로그인이 아닙니다."
                res.send(data)
            }
        }
    })
})

// 사역자 관리 메인 리스트 
router.get('/member', (req, res) => {
    let token = req.headers['access-token'] || req.query.token
    let decoded = jwt.decode(token, secretObj.secret)

    console.log("request Token :", token)
    console.log("DECODED INFO", decoded)
    if (decoded) {
        const query = `select a.ssm_seq, a.ssm_name, a.ssm_team, a.grp_seq, b.chk_isApply, b.chk_isCheck 
                        from (select * from ssm_member) a, ssm_check b
                        where a.ssm_seq = b.ssm_seq;`
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err)
                throw err
            } else {
                console.log("ADMIN USER DATA :", result[0])
                res.send(result)
            }
        })

    } else {
        res.send("no token")

    }

})

module.exports = router;