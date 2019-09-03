<template lang="html">
<div id="app">
    <h1> {{ greeting }} </h1>
    <form id="teamForm" @submit.prevent='arrange' action="/team">
        <table id="myteam" border="1px soild black" style="margin-left: auto; margin-right: auto;">
            <tr>
                <th>이름</th>
                <th>소속팀</th>
                <th>배정그룹</th>
                <th>사역자유형</th>
                <th>작업하기</th>
            </tr>
            <tr v-for="(item, idx) in team" :key="item.ssm_id">
                <td>{{ item.ssm_name }}</td>
                <td>{{ item.ssm_team }}</td>
                <td>-</td>
                <td>견습사역자</td>
                <td><input type="text" v-model="ssm_group"></td>
            </tr>
            <tr>
                <td colspan="5">
                    <input type="button" value="뒤로" @click="goBack">
                    <input type="submit" value="팀 배정하기">
                    <input type="button" value="팀배정"> 
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
    let token = localStorage.getItem('access_token')
    console.log("LocalToken", token)
    let config = {
      headers : {
        "access-token" : token
      }
    }

    this.$http.get('/api/sasamo/myteam', config)
      .then((result) => {
          this.team = result.data.data
          console.log('LIST:', typeof this.team, this.team)
      })
      
    
  },
  data () {
    return {
      greeting : "아래는 사역을 신청한 사역자의 명단입니다. 팀을 배정해주세요",
      team: []
    }
  },
  methods: {
    goBack() {
         this.$router.push({ name: 'sasamo_main'})
     }

  }

}
</script>