<template lang="html">
<div id="app" class="total_container">
    
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4" id="logo_container">
            <img id="logo2" src="../assets/beloved_logo2.png">
            <img id="logo1" src="../assets/beloved_logo1.png">
        </div>
        <div class="col-md-4"></div>
    </div>



    <br>
    <form id="loginForm" @submit.prevent='login' action="/login">
        <table id="login">
            <tr>
                <td>ID</td>
                <td><input class="form-control" type="text" name="id" v-model="ssm_id"></td>
            </tr>
            <tr>
                <td>비밀번호</td>
                <td><input class="form-control" type="password" name="pw" v-model="ssm_pw"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <div id="wrapper_btn">
                    <input class="btn btn-primary" type="button" value="회원가입" v-on:click="signup"> 
                    <input class="btn btn-primary" type="submit" value="로그인">
                    </div>
                </td>
            </tr>
        </table>
    </form>
   
    
</div>
        
</template>
<style scoped>
#login{
    text-align : center;
    margin-left: auto; 
    margin-right: auto;

}
#wrapper_btn{
    margin-top: 10%;
}


</style>

<script>
export default {
  created () {
      
    
  },
  data () {
    return {
      token: "",
      greeting: "사역자님 안녕하세요!"
    }
  },
  methods: {
      login() {
				console.log(this.ssm_id, "id")
      	if(this.ssm_id == null || this.ssm_pw == null){
          alert("아이디와 비밀번호를 입력해주세요.")
        }else {
					this.$http.post('/api/sasamo/login', {
          	id: this.ssm_id,
            pw: this.ssm_pw
        }).then((res) => {
          	this.token = res.data
            console.log("TOKEN :", res.data)
            if(res.data){
              this.$store.commit("updateToken", res.data)
              this.$router.push({ name: 'sasamo_main' })
            }else{
              console.log("kashfdkasdkfl")
              this.log = "올바르지 않은 아이디/패스워드 입니다"
            }
        	})
        }
      },
        signup() {
            this.$router.push({ name: 'sasamo_signup' })
            console.log('signUP')
        }

  }

}
</script>