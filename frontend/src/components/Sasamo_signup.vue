<template lang="html">
<div>
  <h1>회원가입 페이지입니다.</h1>
  <h1>담당사역 확인( {{ checkedDuty }} )</h1>
  <form id="signupForm" @submit.prevent='goSignup'>
  <table border="1px soild black">
    <tr>
        <td>이름</td>
        <td><input type="text" v-model="ssm_name"></td>
    </tr>
    <tr>
        <td>아이디</td>
        <td><input type="text" v-model="ssm_id"><input type="button" value="아이디 중복체크" onclick="id_check()"></td>
    </tr>
    <tr>
        <td>비밀번호</td>
        <td><input type="password" v-model="ssm_pw"></td>
    </tr>
    <tr>
        <td>비밀번호 확인</td>
        <td><input type="password"></td>
    </tr>
    <tr>
        <td>연락처(-없이 입력해주세요)</td>
        <td><input type="text" v-model="ssm_phone"></td>
    </tr>
    <tr>
        <td>담당사역 확인( {{ checkedDuty }} )</td>
        <td>
            <label for="intern">수습사역자</label>
            <input type="checkbox" id="intern" value="I" v-model="ssm_isItrn">
            <label for="heal">치유사역자</label>
            <input type="checkbox" id="heal" value="H" v-model="ssm_isHeal">
            <label for="prophet">예언사역자</label>
            <input type="checkbox" id="prophet" value="P" v-model="ssm_isPrpt">
            <label for="pastor">목회자</label>
            <input type="checkbox" id="pastor" value="M" v-model="ssm_isPstr">
        </td>
    </tr>
    <tr>  
      <td colspan="2"><input type="submit" value="회원가입"></td> 
    </tr>
    </table>
    </form>
    </div>
</template>

<script>
export default {
  created () {
    
  },
  data () {
    return {
      checkedDuty: []
    }
  },
  methods: {
      goSignup() {
      console.log(this.ssm_phone)
        this.$http.post('/api/sasamo/signup', {
          ssm_name : this.ssm_name,
          ssm_id : this.ssm_id,
          ssm_pw : this.ssm_pw,
          ssm_phone: this.ssm_phone,
          ssm_isItrn : this.ssm_isItrn ? "Y" : "N",
          ssm_isHeal : this.ssm_isHeal ? "Y" : "N",
          ssm_isPrpt : this.ssm_isPrpt ? "Y" : "N",
          ssm_isPstr : this.ssm_isPstr ? "Y" : "N"
        })
      this.$router.push({ name: 'sasamo'})
      console.log('goMain')
    }
  }

}
</script>
