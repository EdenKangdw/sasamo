<template lang="html">
<div>
  <h1>로그인 페이지입니다.</h1>
  <h1>{{ user.id }}님 환영합니다</h1>

  <input type="button" :value="main_btn">
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
  }
}
</script>
