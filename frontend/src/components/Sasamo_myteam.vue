<template lang="html">
<div id="app">
    <h1> {{ greeting }} </h1>
    <form id="teamForm" @submit.prevent='arrange' action="/team">
        <table id="myteam" border="1px soild black" style="margin-left: auto; margin-right: auto;">
            <tr>
                <th>이름</th>
                <th>소속팀</th>
                <th>현재 배정그룹</th>
                <th>멤버유형</th>
                <th>배정할 그룹</th>
            </tr>
            <tr v-for="(item, idx) in team" :key="item.ssm_id">
                <td>{{ item.ssm_name }}</td>
                <td>{{ item.ssm_team }}</td>
                <td>{{ item.ssm_group ? item.ssm_group : '-'  }} </td>
                <td>{{ item.ssm_type }}</td>
                <td>
                    <select :id="item.ssm_name" v-model="item.ssm_id" @change="onChange($event)">
                        <option value="1">1팀</option>
                        <option>2팀</option>
                        <option>3팀</option>
                        <option>4팀</option>
                    </select>
                </td> 
                
            </tr>
            <tr>
                <td> {{ exp }} </td>
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
              this.editTeam.push({'id' : myTeam[i].ssm_id, 'ssm_group' : ''})
              switch (myTeam[i].ssm_type){
                  case 'I' : 
                    myTeam[i].ssm_type = 'A'
                    break
                  case 'P' : 
                    myTeam[i].ssm_type = 'B'
                    break
                  case 'M' : 
                    myTeam[i].ssm_type = 'C'
                    break
                  default : myTeam[i].ssm_type = 'D'
              }
            console.log('TYPE :', myTeam[i].ssm_type, i)
            console.log(this.editTeam[i])
          }
          this.team = myTeam
          
          // console.log('LIST:', typeof this.team, this.team)
      })
      
    
  },
  data () {
    return {
      greeting : "아래는 사역을 신청한 사역자의 명단입니다. 팀을 배정해주세요",
      team: [],
      editTeam: [],
      exp: []
    }
  },
  methods: {
    goBack() {
         this.$router.push({ name: 'sasamo_main' })
     },

     onChange(event) {
        this.exp.push({'id': event.target.id, 'ssm_group' : event.target.value })
        
     }
     

  }

  


}
</script>