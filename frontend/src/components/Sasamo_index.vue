<template lang="html">
<div id="app">
    <h1> {{ log }} </h1>
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
                    <input type="button" value="회원가입" v-on:click="signup"> 
                </td>
            </tr>
        </table>
    </form>
</div>
        
</template>
<style>
#login{
    text-align : center;
    margin-left: auto; 
    margin-right: auto;

}
</style>

<script>
export default {
  created () {
    
  },
  data () {
    return {
      user: {},
      log: "로그인을 해주세요"
    }
  },
  methods: {
      login() {
            this.$http.post('/api/sasamo/login', {
                id: this.ssm_id,
                pw: this.ssm_pw
            }).then((res) => {
                this.user = res.data
                    if(res.data.ok === true){
                        this.$router.push({ name: 'sasamo_main', params: { id: this.ssm_id, pw: this.ssm_pw }})
                        console.log('login:', this.ssm_id)
                    }else{
                        this.log = "올바르지 않은 아이디/패스워드 입니다"
                    }
        })
      },
        signup() {
            this.$router.push({ name: 'sasamo_signup' })
            console.log('signUP')
        }

  }

}
</script>