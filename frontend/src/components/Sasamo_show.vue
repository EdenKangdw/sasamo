<template lang="html">
<div>
  <h1>로그인 페이지입니다.</h1>
  <h1>데이터 {{user}} 나와라</h1>
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
        console.log('show:', res.data.id)
        console.log('data:', this.user.id, typeof this.user)

      })
  },
  data () {
    return {
      user: {}
    }
  }
}
</script>
