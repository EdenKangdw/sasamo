<template lang="html">
<div>
  <h1>회원가입 페이지입니다.</h1>
  <h1>담당사역 확인( {{ checkedDuty }} )</h1>
  <form id="signupForm" @submit.prevent='goSignup'>
  <table border="1px soild black" style="margin-left: auto; margin-right: auto;">
    <tr>
        <td>이름</td>
        <td><input type="text" v-model="ssm_name"></td>
    </tr>
    <tr>
        <td>아이디</td>
        <td><input type="text" v-model="ssm_id">
        <input type="button" value="아이디 중복체크" @click="checkId">
        {{ idLog }}
        <input type="hidden" :value="idIsChecked">
        </td>
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
        <td>팀 번호</td>
        <td><input type="text" v-model="ssm_team"></td>
    </tr>
    <tr>
        <td>기수 확인( {{ ssm_gen }} )</td>
        <td>
            <label for="ssm_gen1">1기</label>
            <input type="radio" id="ssm_gen1" value="1" v-model="ssm_gen">
            <label for="ssm_gen2">2기</label>
            <input type="radio" id="ssm_gen2" value="2" v-model="ssm_gen">
        </td>
    </tr>
    <tr>
        <td>담당사역 확인( {{ checkedDuty }} )</td>
        <td>
            <label for="intern">훈련생</label>
            <input type="radio" id="intern" value="I" v-model="checkedDuty">
            <label for="prophet">예언사역자</label>
            <input type="radio" id="prophet" value="P" v-model="checkedDuty">
            <label for="pastor">교역자</label>
            <input type="radio" id="pastor" value="M" v-model="checkedDuty">
        </td>
    </tr>
</table>
      <input type="button" value="뒤로" @click="goBack">
      <input type="submit" value="회원가입">
    </form>
    </div>
</template>

<script>
export default {
  created () {
    
  },
  data () {
    return {
        checkedDuty: '',
        idIsChecked: "n",
        idLog: "아이디를 입력해주세요",
        ssm_type : '',
        ssm_gen : '',
        isRightPassword : 'n'

    }
  },
  methods: {
      goSignup() {
          if(this.idIsChecked != 'y'){
              alert('중복되지 않는 아이디를 입력해주세요')
          } else {
            console.log(this.ssm_phone)
            this.ssm_type = this.checkedDuty
            console.log('TYPE : ' ,this.ssm_type)
      
            this.$http.post('/api/sasamo/signup', {
                ssm_name : this.ssm_name,
                ssm_id : this.ssm_id,
                ssm_pw : this.ssm_pw,
                ssm_phone: this.ssm_phone,
                ssm_team : this.ssm_team,
                ssm_type : this.ssm_type,
                ssm_gen : this.ssm_gen,
            })
            this.$router.push({ name: 'sasamo'})
            console.log('goMain')
        }
    },
    checkId(){
        this.$http.post('api/sasamo/checkid', {
            id : this.ssm_id
        }).then(res => {
            console.log('checkID :',res)
            if(res.data.data){
                this.idIsChecked = 'y'
                this.idLog = "사용가능한 아이디입니다"
            } else {
                this.idIsChecked = 'n'
                this.idLog = "이미 사용중인 아이디입니다"
            }
        })

    },
    goBack() {
      this.$router.push({ name: 'sasamo'})
    }
  }

}
</script>
