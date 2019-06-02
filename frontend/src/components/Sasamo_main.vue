<template lang="html">
<div>
  <h1>{{ user.name }}님 환영합니다</h1>
  <h1>{{user.group}}팀 입니다</h1>

  <input type="button" :value="main_btn" v-on:click="count">
  <input type="button" :value="user.id">

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
        if(res.data.ok){
          this.main_btn = "출석체크"
        }else{
          this.main_btn = "출석 취소하기"
        }
        console.log('show:', res.data.id)
        console.log('data:', this.user.id, typeof this.user)

      })
  },
  data () {
    return {
      user: {},
      main_btn: ""
    }
  },
  method: {
    count() {
      this.$http.post('/count')
      .then((res) => {
        alert('출석체크 완료!')
      }) 
        

  }
}
}
</script>
