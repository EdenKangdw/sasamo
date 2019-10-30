<template lang="html">
<div>
  <h1 ><span id="tm_info">{{ user.ssm_name }}</span>님 환영합니다</h1>
  <h1><span id="tm_info">{{ user.ssm_group }}팀</span>입니다</h1> 
  
<input type="button" value="뒤로" @click="goBack">
  <input type="button" :value="btn_apply ? '사역신청 취소' : '사역신청'" @click="btnApply">
  <input v-if="btn_apply" type="button" :value="btn_check ? '출석취소' : '출석체크'" @click="btnCheck">
  <input type="button" :value="btn_team ? '팀 배정하기' : '팀 확인하기'" @click="myTeam">
  
</div>

</template>
<style>
#tm_info {
    font-size: 1.4em;
    color: #FF9CB4;
}
</style>

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
    this.$http.get('/api/sasamo//user/info', config)
      .then((res) => {
        console.log('RESULT : ', res.data)
        // 로그인이 완료되면 오늘 이벤트에 사역신청 했는지 확인 
        this.user = res.data
        console.log('유저', this.user)
        if(this.user.ok){
          console.log("isToday? :", this.user.isTodayApply)
          // 로그인 성공 
          this.$store.commit("updateEvent", this.user.eventSeq) 
          if(this.user.leader === 'y'){
            // 팀장인 경우 
            this.loginLeader(this.user.isTodayApply, this.user.isTodayCheck)
            console.log('a',this.btn_apply)
        } else {
          // 일반 사역자의 경우 
            this.loginNormal(this.user.isTodayApply, this.user.isTodayCheck)
            console.log('b',this.btn_apply)
        }
      }
    })
  },
  data () {
    return {
      user: {},
      today: {},
      btn_apply: false,
      btn_check: false,
      btn_team: false,
    }
  },
  methods: {
    btnCheck() {
      console.log("SSSSSSS")
      switch(this.btn_check){
        case false : 
          console.log('user', this.user)
          this.check()
          this.btn_check = true
          break
        case true : 
          this.cancel()
          this.btn_check = false
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
          console.log('출석은했나?',this.btn_apply)
          break
        case true : 
          this.cancel()
          this.btn_apply = false
          break
        default :
          alert("sadfsads;lfjasdflasjdlfjsdfldfdsf")
      }
      
    },
    // 출석체크가 y인 경우 체크해야함 

    loginLeader(isTodayApply, isTodayCheck){
      if (isTodayApply == 'y' && isTodayCheck == 'y') {
              // 팀장 이면서 사역신청 o 출석체크 o
              console.log('L : O/O')
              this.btn_apply = true
              this.btn_check = true
              this.btn_team = true
      } else if (isTodayApply === 'y' && isTodayCheck === 'n'){
              // 팀장이면서 신청 o 체크 x
              console.log('L : O/X')
              this.btn_apply = true
              this.btn_check = false
              this.btn_team = true
            } else {
              console.log('L : X/X')
              this.btn_apply = false
              this.btn_check = false
              this.btn_team = true
            }
    },
    loginNormal(isTodayApply, isTodayCheck){
      console.log('IS :', isTodayApply, isTodayCheck)
      if (isTodayApply == 'y' && isTodayCheck == 'y') {
              // 일반 이면서 사역신청 o 출석체크 o
              console.log('N : O/O')
              this.btn_apply = true
              this.btn_check = true
              this.btn_team = false
      } else if (isTodayApply === 'y' && isTodayCheck === 'n'){
              // 일반이면서 신청 o 체크 x
              console.log('N : O/X')
              this.btn_apply = true
              this.btn_check = false
              this.btn_team = false
            } else { // 일반 : 신청 x 체크 x
              console.log('N: X/X')
              this.btn_apply = false
              this.btn_check = false
              this.btn_team = false
            }
    },

    check() {
      let token = localStorage.getItem('access_token')
      console.log("LocalToken", token)
      let evt_seq = localStorage.getItem('Event')
    
    
    this.$http.post('/api/sasamo/check',  {
      evt_seq : evt_seq

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
      let evt_seq = localStorage.getItem('Event')

      this.$http.post('/api/sasamo/cancelCheck', {
        token: token,
        evt_seq : evt_seq
      })
       .then((res) => {
        console.log('사역신청 취소 완료')
        alert('사역신청 취소 완료!')
      })
    },
    myTeam() {
      this.$router.push({ name: 'sasamo_myteam' })
    },
    goBack() {
      this.$router.push({ name: 'sasamo'})
    }

    
},
}
</script>

