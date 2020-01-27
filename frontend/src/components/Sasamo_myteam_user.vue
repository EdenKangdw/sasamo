<template lang="html">
<div class="row">
    <div class="total_container">
    <h2> <span class="user_info">{{ greeting }} </span></h2>
    <br>
    <form id="teamForm" @submit.prevent='arrange' action="/team">
        <table class="table" id="myteam" style="margin-left: auto; margin-right: auto;">
            <tr>
                <th>이름</th>
                <th>역할</th>
                
            </tr>
            <tr v-for="(item, idx) in team" :key="item.ssm_id">
         
                <!-- <td class="team_type1" v-if="item.ssm_grptype == '조장'">{{ item.ssm_name }}</span></td>
                <td class="team_type1"v-if="item.ssm_grptype == '조장'">{{ item.ssm_grptype }}</span></td>
                <td class="team_type2" v-if="item.ssm_grptype == '부조장'">{{ item.ssm_name }}</span></td>
                <td class="team_type2"v-if="item.ssm_grptype == '부조장'">{{ item.ssm_grptype }}</span></td>
                <td class="team_type3" v-if="item.ssm_grptype == '교역자'">{{ item.ssm_name }}</span></td>
                <td class="team_type3"v-if="item.ssm_grptype == '교역자'">{{ item.ssm_grptype }}</span></td>
                <td class="team_type4" v-if="item.ssm_grptype == '훈련생'">{{ item.ssm_name }}</span></td>
                <td class="team_type4"v-if="item.ssm_grptype == '훈련생'">{{ item.ssm_grptype }}</span></td>
                <td class="team_type5" v-if="item.ssm_grptype == '조원'">{{ item.ssm_name }}</span></td>
                <td class="team_type5"v-if="item.ssm_grptype == '조원'">{{ item.ssm_grptype }}</span></td> -->
         
                <td v-if="item.ssm_grptype == '조장'"><span class="team_type1">{{ item.ssm_name }}</span></td>
                <td v-if="item.ssm_grptype == '조장'"><span class="team_type1">{{ item.ssm_grptype }}</span></td>

                <td v-if="item.ssm_grptype == '부조장'"><span class="team_type2">{{ item.ssm_name }}</span></td>
                <td v-if="item.ssm_grptype == '부조장'"><span class="team_type2">{{ item.ssm_grptype }}</span></td>
            
                <td v-if="item.ssm_grptype == '교역자'"><span class="team_type3">{{ item.ssm_name }}</span></td>
                <td v-if="item.ssm_grptype == '교역자'"><span class="team_type3">{{ item.ssm_grptype }}</span></td>

                <td v-if="item.ssm_grptype == '훈련생'"><span class="team_type4">{{ item.ssm_name }}</span></td>
                <td v-if="item.ssm_grptype == '훈련생'"><span class="team_type4">{{ item.ssm_grptype }}</span></td>

                <td v-if="item.ssm_grptype == '조원'"><span class="team_type5">{{ item.ssm_name }}</span></td>
                <td v-if="item.ssm_grptype == '조원'"><span class="team_type5">{{ item.ssm_grptype }}</span></td>



            </tr>
            <tr>
                <td colspan="5">
                    <input class="btn btn-primary" type="button" value="뒤로" @click="goBack">
                    <input class="btn btn-primary" type="button" value="팀 배정하기" @click="goArrange">
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

.team_type1 {
    font-weight: bold;
    color : rgb(235, 124, 192);
    
}
.team_type2 {
    font-weight: bold;
    color : rgb(125, 177, 67);
}
.team_type3 {
    font-weight: bold;
    color : rgb(252, 146, 25);
}
.team_type4 {
    font-weight: bold;
    color : rgb(96, 98, 224);
}
.team_type5 {
    font-weight: bold;
   
} 
/* 
.team_type1 {
    background-color: blueviolet;
    opacity: 0.5;
    color:white;
    font-weight: bold;
}

.team_type2 {
    background-color: rgb(43, 128, 226);
    opacity: 0.5;
    color:white;
    font-weight: bold;
}

.team_type3 {
    background-color: rgb(226, 131, 43);
    opacity: 0.5;
    color:white;
    font-weight: bold;
}

.team_type4 {
    background-color: rgb(226, 43, 113);
    opacity: 0.5;
    color:white;
    font-weight: bold;

}.team_type5 {
    background-color: rgb(226, 43, 211);
    opacity: 0.5;
    color:white;
    font-weight: bold;
} */

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

    this.$http.get('/api/sasamo/team/list', config)
        .then( (result) => {
            if(result.data.data != 'none'){
                console.log('teamDATA',result.data.data)
                 let myTeam = result.data.data
                    for(var i in myTeam){
                        console.log("변환하기")
                        switch (myTeam[i].ssm_grptype){
                            case 'A' : 
                                myTeam[i].ssm_grptype = '조장'
                                break
                            case 'B' : 
                                myTeam[i].ssm_grptype = '부조장'
                                break
                            case 'C' : 
                                myTeam[i].ssm_grptype = '교역자'
                                break
                            case 'D' :
                                myTeam[i].ssm_grptype = '훈련생'
                                break
                            default : myTeam[i].ssm_grptype = '조원'
                        }
                        console.log('TYPE :', myTeam[i].ssm_grptype, i)
                        console.log(this.editTeam[i])
                    }
          this.team = myTeam
                
            } else {
                console.log(myTeam)
                
            }
        })

    // this.$http.get('/api/sasamo/team/applied', config)
    //   .then((result) => {
        //   let myTeam = result.data.data
        //   for(var i in myTeam){
        //       switch (myTeam[i].ssm_type){
        //           case 'I' : 
        //             myTeam[i].ssm_type = '훈련생'
        //             break
        //           case 'P' : 
        //             myTeam[i].ssm_type = '예언사역자'
        //             break
        //           case 'M' : 
        //             myTeam[i].ssm_type = '교역자'
        //             break
        //           default : myTeam[i].ssm_type = '치유사역자'
        //       }
        //     console.log('TYPE :', myTeam[i].ssm_type, i)
        //     console.log(this.editTeam[i])
        //   }
        //   this.team = myTeam
          
    //       // console.log('LIST:', typeof this.team, this.team)
    //   })
      
    
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