<template lang="html">
<div>
  <h1>{{ user.ssm_name }}님 환영합니다</h1>
  <h1>{{ user.ssm_group }}팀 입니다</h1>
  <h1>{{log}}</h1>
  <input type="button" :value="btn_apply" @click="btnApply">
  <input type="button" :value="btn_check" @click="btnCheck">
  <input type="button" :value="btn_team" @click="go">

</div>

</template>

<script>
export default {
  created () { 
    let token = localStorage.getItem('access_token')
    console.log("LocalToken", token)
    let config = {
      headers : {
        "access-token" : token
      }
    }
    this.$http.get('/api/sasamo/getUserInfo', config)
      // 로그인 api 요청 
      .then((res) => {
        console.log('RESULT : ', res.data)
        // 로그인이 완료되면 오늘 이벤트에 사역신청 했는지 확인 
        this.user = res.data
        console.log('마지막 유저', this.user)

        if(this.user.ok){
          console.log("SADFASDFDSAF", this.user.isToday)
          // 로그인 성공 
          if(this.user.leader == 'y'){
            // 팀장인 경우 
            this.loginLeader(this.user.isToday)
            console.log('a',this.btn_apply)
        } else {
          // 일반 사역자의 경우 
            this.loginNormal(this.user.isToday)
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
      log: this.$store.state.user
    }
  },
  methods: {
    
    btnCheck() {
      console.log("SSSSSSS")
      switch(this.btn_check){
        case '출석체크' : 
          console.log('sdflkjsadlkfjlksjdf')
          console.log('user', this.user)
          this.check()
          this.today.today = 'y'
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
        case '사역신청' : 
          console.log('sdflkjsadlkfjlksjdf')
          console.log('user', this.user)
          this.check()
          this.today.today = 'y'
          this.btn_apply = "사역신청 취소"
          break
        case '사역신청 취소' : 
          this.cancel()
          this.btn_apply = "사역신청"
          break
        default :
          alert("sadfsads;lfjasdflasjdlfjsdfldfdsf")
      }
      
    },

    loginLeader(isToday){
      switch (isToday) {
              // 팀장 이면서 사역신청  
              case 'n' : 
              this.btn_apply = "사역신청"
              this.btn_check = "출석체크"
              this.btn_team = '팀 배정하기'
              break

              case 'y' :
              this.btn_apply = "사역신청 취소"
              this.btn_check = "출석체크"
              this.btn_team = '팀 배정하기'
              break
            }
    },
    loginNormal(isToday){
      switch (isToday) {
              // 일반 이면서 사역신청  
              case 'n' : 
              this.btn_apply = "사역신청",
              this.btn_check = "출석체크"
              this.btn_team = "우리팀 확인"
              break

              case 'y' :
              this.btn_apply = "사역신청 취소",
              this.btn_check = "출석체크"
              this.btn_team = "우리팀 확인"
              break
            }
    },

    check() {
      this.$http.post('/api/sasamo/check', {
        ssm_seq : this.today.ssm_seq,
        ssm_name : this.today.ssm_name,
        evt_seq : this.today.evt_seq,
        evt_name : this.today.evt_name,
        check : this.today.today

      })
      .then((res) => {
        console.log('show', this.today)
        alert('출석체크 완료!')
      }) 
  },
    cancel(){
      this.$http.post('/api/sasamo/cancelCheck', {
        ssm_seq: this.today.ssm_seq,
        evt_seq: this.today.evt_seq,
        check: this.today.today
      }).then((res) => {
        console.log('사역신청 취소 완료')
        this.btn_apply = '사역신청'
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

