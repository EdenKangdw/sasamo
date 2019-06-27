<template lang="html">
<div>
  <h1>{{ user.name }}님 환영합니다</h1>
  <h1>{{ user.group }}팀 입니다</h1>

  <input type="button" :value="btn_apply" @click="go">
  <input type="button" :value="btn_check" @click="go">
  <input type="button" :value="btn_team" @click="go">

</div>

</template>

<script>
export default {
  created () { 
    var ssm_id = this.$route.params.id
    var ssm_pw = this.$route.params.pw
    this.$http.post('/api/sasamo/login', {
        id: ssm_id,
        pw: ssm_pw
      }).then((res) => {
        this.user = res.data
        console.log('user 1',this.user)
        if(res.data.ok){
          // 로그인 성공 
          if(res.data.leader == 'y'){
            // 팀장인 경우 
            switch (res.data.isToday) {
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
        } else {
          // 일반 사역자의 경우 
          switch (res.data.isToday) {
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
        }
          
          
        }

        this.$http.post('/api/sasamo/today', {
          user : this.user
        }).then((res) => {
          this.today = res.data.data
          console.log('today',this.today)
          console.log('마지막 유저', this.user)
        })
        
        console.log('show:', res.data.id)
        console.log('data:', this.user.id, typeof this.user)

      })
  },
  data () {
    return {
      user: {},
      today: {},
      btn_apply: "",
      btn_check: "",
      btn_team: ""
    }
  },
  methods: {
    
    go() {
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

    go2() {
    },

    check() {
      this.$http.post('/api/sasamo/check', {
        userSeq : this.today.userSeq,
        userName : this.today.username,
        evtSeq : this.today.eventSeq,
        evtName : this.today.eventName,
        check : this.today.today

      })
      .then((res) => {
        console.log('show', this.today)
        alert('출석체크 완료!')
      }) 
  },
    cancel(){
      this.$http.post('/api/sasamo/cancel')
    }
    
}
}
</script>

