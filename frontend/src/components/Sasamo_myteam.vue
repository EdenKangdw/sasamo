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
                <td>{{ item.ssm_group ? item.ssm_group : '-'  }} </td>
                <td>{{ item.ssm_type }}</td>
                <td><input type="text" v-model="ssm_group"></td> 
                <!-- <td><select option>-->
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

    this.$http.get('/api/sasamo/team/applied', config)
      .then((result) => {
          let myTeam = result.data.data
          for(var i in myTeam){
              console.log(myTeam[i].ssm_type)
              switch (myTeam[i].ssm_type){
                  case 'I' : 
                    myTeam[i].ssm_type = '훈련생'
                    break
                  case 'P' : 
                    myTeam[i].ssm_type = '예언사역자'
                    break
                  case 'M' : 
                    myTeam[i].ssm_type = '교역자'
                    break
                  default : myTeam[i].ssm_type = '치유사역자'
              }
            console.log('TYPE :', myTeam[i].ssm_type, i)
          }
          this.team = myTeam
          // console.log('LIST:', typeof this.team, this.team)
      })
      
    
  },
  data () {
    return {
      greeting : "아래는 사역을 신청한 사역자의 명단입니다. 팀을 배정해주세요",
      team: [],
    }
  },
  methods: {
    goBack() {
         this.$router.push({ name: 'sasamo_main'})
     }

  }

}
</script>