<template lang="html">
<div class="row">
    <div class="total_container">
    <h2> {{ greeting }} </h2>
    <br>
    <form id="teamForm" @submit.prevent='arrange' action="/team">
        <table class="table" id="myteam" style="margin-left: auto; margin-right: auto;">
            <tr>
                <th>이름</th>
                <th>역할</th>
            </tr>
            <tr v-for="(item, idx) in team" :key="item.ssm_id">
                <td>{{ item.ssm_name }}</td>
                <td>{{ item.ssm_team }}</td>
                <td>{{ item.ssm_group ? item.ssm_group : '-'  }} </td>
                <td>{{ item.ssm_type }}{{ item.ssm_gen }}</td>
                <td>
                    <select :id="item.ssm_seq" v-model="item.ssm_seq" @change="onChange($event)">
                        <option v-for="(team, idx) in teamList" :key="idx">
                            {{ team }}
                        </option>
                    </select>
                </td> 
                
            </tr>
            <tr>
                <td> {{ editTeam }} </td>
                <td> {{ teamList }} </td>
                
            </tr>
            <tr>
                <td colspan="5">
                    <input type="button" value="뒤로" @click="goBack">
                    <input type="button" value="팀 배정하기" @click="goArrange">
                </td>
            </tr>
        </table>
    </form>
</div>
</div>

        
</template>
<style scoped>
#login{
    text-align : center;
    margin-left: auto; 
    margin-right: auto;
}

.row {
    background-image: url('../assets/flower_pattern.jpg');
    z-index: 1;
    height: 100vh;
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
    console.log(this.user_info)

    this.$http.get('/api/sasamo/team/list', config)
        .then((result) => {
            if(result.data.data != 'none'){
                console.log(result.data.data)
                this.teamList = result.data.data.split(",")
                console.log('VUE TEAMLIST :', this.teamList, typeof this.teamList, this.editTeam)
            } else {
                console.log(result.data.data)
                this.teamList = []
            }
        })

    this.$http.get('/api/sasamo/team/applied', config)
      .then((result) => {
          let myTeam = result.data.data
          for(var i in myTeam){
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
            console.log(this.editTeam[i])
          }
          this.team = myTeam
          
          // console.log('LIST:', typeof this.team, this.team)
      })
      
    
  },
  data () {
    return this.initialData()
  },
  methods: {
    resetData() {
        Object.assign(this.$data, this.initialData)
    }, 

    initialData(){
     return {
      greeting : "오늘의 팀",
      team: [],
      editTeam: [],
      teamList: [],
        }
    },

    goBack() {
         this.$router.push({ name: 'sasamo_main' })
     },

     onChange(event) {
        this.editTeam.push({'id': event.target.id, 'ssm_group' : event.target.value })
     },
     goArrange() {
            let token = localStorage.getItem('access_token')
            let evt_seq = localStorage.getItem('Event')
            console.log('eventcode :',evt_seq)
            this.$http.post('/api/sasamo/team/arrange',  {
                editTeam: this.editTeam,
                evt_seq: evt_seq
                }, { headers: { 'access-token': token }  
            })
            .then(
                (res) => {
                this.teamList = []
                console.log('show', res)
                alert('팀 배정 완료!')
                },
                (error) => {console.log('ARRANGE ERROR :', error.response)}
            )
             
        }
         
     
     

  }

  


}
</script>