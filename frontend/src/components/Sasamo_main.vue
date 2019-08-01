<template lang="html">
<div>
  <h1>{{ user.ssm_name }}님 환영합니다</h1>
  <h1>{{ user.ssm_group }}팀 입니다</h1>
  <h1>{{log}}</h1>
  <input type="button" :value="btn_apply ? '사역신청 취소' : '사역신청'" @click="btnApply">
  <input type="button" :value="btn_check ? '출석취소' : '출석체크'" @click="btnCheck">
  <input type="button" :value="btn_team ? '팀 배정하기' : '팀 확인하기'" @click="go">
  
</div>

</template>

<script>
export default {
  created () { 
    // 로컬스토리지에 저장된 토큰 가져오기 : 새로고침해도 로그인 풀리지 않음
    let token = localStorage.getItem('access_token')
    console.log("LocalToken", token)
    let config = {
      headers : {
        "access-token" : token
      }
    }

    // 유저정보 api 요청 : 오늘에 대해 출석체크를 했는지 값도 리턴됨
    this.$http.get('/api/sasamo/getUserInfo', config)
      .then((res) => {
        console.log('RESULT : ', res.data)
        // 로그인이 완료되면 오늘 이벤트에 사역신청 했는지 확인 
        this.user = res.data
        console.log('유저', this.user)
        if(this.user.ok){
          console.log("isToday? :", this.user.isTodayApply)
          // 로그인 성공 
          if(this.user.leader != null){
            // 팀장인 경우 
            this.loginLeader(this.user.isTodayApply)
            console.log('a',this.btn_apply)
        } else {
          // 일반 사역자의 경우 
            this.loginNormal(this.user.isTodayApply)
            console.log('b',this.btn_apply)
        }
      }
    })
  },
  data () {
    return {
      user: {},
      today: {},
      btn_apply: "",
      btn_check: "",
      btn_team: "",
      log: this.$store.state.log
    }
  },
  methods: {

    

    btnCheck() {
      console.log("SSSSSSS")
      switch(this.btn_check){
        case '출석체크' : 
          console.log('user', this.user)
          this.check()
          break
        case '출석취소' : 
          this.cancel()
          break
        default :
          alert("sadfsdfdsf")
      }
    },

    btnApply() {
      console.log("SSSSSSS", this.btn_apply)
      switch(this.btn_apply){
        case false : 
          console.log('sdflkjsadlkfjlksjdf')
          console.log('user', this.user)
          this.check()
          this.btn_apply = true
          console.log(this.btn_apply)
          break
        case true : 
          this.cancel()
          this.btn_apply = false
          break
        default :
          alert("sadfsads;lfjasdflasjdlfjsdfldfdsf")
      }
      
    },

    loginLeader(isTodayApply){
      switch (isTodayApply) {
              // 팀장 이면서 사역신청해야함 
              case 'n' : 
              this.btn_apply = false
              this.btn_check = false
              this.btn_team = true
              break

              // 이미 신청함
              case 'y' :
              this.btn_apply = true
              this.btn_check = false
              this.btn_team = true
              break
            }
    },
    loginNormal(isTodayApply){
      switch (isTodayApply) {
              // 일반 이면서 사역신청 해야함
              case 'n' : 
              this.btn_apply = false,
              this.btn_check = false
              this.btn_team = false
              break

              // 신청함 
              case 'y' :
              this.btn_apply = true,
              this.btn_check = false
              this.btn_team = false
              break
            }
    },

    check() {

      let token = localStorage.getItem('access_token')
      console.log("LocalToken", token)
    
    
    this.$http.post('/api/sasamo/check',  {
      ssm_seq: this.user.ssm_seq,
      ssm_name: this.user.ssm_name
    }, { headers: { 'access-token': token },  
    })
      .then((res) => {
        console.log('show', res)
        alert('출석체크 완료!')
      }) 
  },
    cancel(){
      let token = localStorage.getItem('access_token')
      console.log("LocalToken", token)

      this.$http.post('/api/sasamo/cancelCheck', { headers: { 'access-token': token } })
       .then((res) => {
        console.log('사역신청 취소 완료')
        alert('사역신청 취소 완료!')
      })
    }
    
},
watch: {
  isToday : function(newVal){
    this.user.isToday = newVal
  }
}
}
</script>

