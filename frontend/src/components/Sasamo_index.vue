<template lang="html">
<div id="app">
    <h1>로그인을 해주세요 {{log}}</h1>
    <form id="loginForm" @submit.prevent='login' action="/login">
        <table id="login">
            <tr>
                <td>ID</td>
                <td><input type="text" name="id" v-model="ssm_id"></td>
            </tr>
            <tr>
                <td>비밀번호</td>
                <td><input type="password" name="pw" v-model="ssm_pw"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <input type="submit" value="login">
                    <input type="button" value="회원가입">
                </td>
            </tr>
        </table>
    </form>
</div>
        
</template>

<script>
export default {
  created () {
    this.$http.get('api/db/mysql/test')
    .then((response) => {
      this.movies = response.data
    })
  },
  data () {
    return {
      user: {}
    }
  },
  methods: {
      login() {
      this.$router.push({ name: 'sasamo_show', params: { id: this.ssm_id, pw: this.ssm_pw }})
      console.log('login:', this.ssm_id)
    }
  }

}
</script>