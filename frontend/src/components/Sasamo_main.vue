<template lang="html">
	<div class="row">
<div class="total_container">
		<!--Greed 1 start-->
		
			<div class="col-md-4"></div>
  		<div class="col-md-4" id="logo_container">
    		<img id="logo2" src="../assets/beloved_logo2.png">
      	<img id="logo1" src="../assets/beloved_logo1.png">
    	</div>
    	<div class="col-md-4"></div>
		
		<!--Greed 1 end-->
<br>
		<!--Greed 2 start-->
		<div class="col-md-4"></div>
		<div class="col-md-4 content-wrapper">
  		<div>
    		<h2><span class="user_info" id="tm_info">{{ user.ssm_name }}</span>님</h2>
    		<h2><span class="user_info"id="tm_info">{{ user.grp_seq }}팀</span>입니다</h2> 
  		</div>
		</div>
	  <div class="col-md-4"></div>

		<!-- greed 2 end -->
    <br>

    <!--Greed 2 start-->
		<div class="col-md-3"></div>
		<div class="col-md-6 content-wrapper">
  		<div>
    		<select class="form-control event" v-model="selected">
          <option v-for="event in events" v-bind:value="event.evt_seq">
            {{ event.evt_name }}
          </option>
        </select>
  		</div>
		</div>
	  <div class="col-md-3"></div>

		<!--Greed 3 start-->
  	<div class="col-md-4"></div>
  	<div class="col-md-4 btn_wrapper"> 
    	<div class="btn_item"><input class="btn btn-primary" type="button" :value="btn_apply ? '사역신청 취소' : '사역신청'" @click="btnApply"></div>
     	<div class="btn_item"><input v-if="btn_apply" class="btn btn-primary" type="button" :value="btn_check ? '출석취소' : '출석체크'" @click="btnCheck"></div>
     	<div class="btn_item"><input class="btn btn-primary" type="button" :value="'팀 정보보기'" @click="myTeamUser"></div>
     	<div class="btn_item"><input v-if="btn_team" class="btn btn-primary" type="button" :value="'팀 배정하기'" @click="myTeamLeader"></div>
			<img class="btn-back" src="../assets/icons8-back-arrow-64.png" @click="goBack">
     	<!-- <div class="btn_item"><input class="btn-back" type="button" value="←" @click="goBack"></div> -->
   	</div>
   	<div class="col-md-4"></div>
		<!--Greed 3 end--> 

   
  	</div>
</div>

</template>
<style scoped>
	.row {
		background-image: url('../assets/flower_pattern.jpg');
		z-index: 1;
    height: 100vh;
	}
</style>


<script>
export default {
  
  created () { 
    // 로컬스토리지에 저장된 토큰 가져오기 : 새로고침해도 로그인 풀리지 않음
    let token = localStorage.getItem('access_token')
    console.log("LocalToken", token)
    let config = {
      headers : {
        "access-token" : token
      }
    }

    // 유저정보 api 요청 : 오늘에 대해 출석체크를 했는지 값도 리턴됨
  this.$http.get('api/sasamo/event/today', config)
    .then(res => {
      console.log(res.data)
      this.events = res.data.data
      this.selected = res.data.data[0].evt_seq
      console.log(this.selected)
    })


    
  },
  data () {
    return {
      user: {},
      today: {},
      events: {},
      selected: '',
      btn_apply: false,
      btn_check: false,
      btn_team: false,
    }
  },
  watch : {
    selected(new_evt_seq){
      
      this.selected = new_evt_seq
      let token = localStorage.getItem('access_token')
      let config = {
      headers : {
          "access-token" : token
        }
      }

      this.$http.post('/api/sasamo/user/info', {evt_seq : this.selected}, config)
      .then((res) => {
        console.log('RESULT : ', res.data)
        // 로그인이 완료되면 오늘 이벤트에 사역신청 했는지 확인 
        this.user = res.data
        console.log('유저', this.user)
        if(this.user.ok){
          console.log("isToday? :", this.user.isTodayApply)
          // 로그인 성공 
          this.$store.commit("updateEvent", this.user.eventSeq) 
          if(this.user.leader != 'n'){
            // 팀장인 경우 
            this.loginLeader(this.user.isTodayApply, this.user.isTodayCheck)
            console.log('a',this.btn_apply)
        } else {
          // 일반 사역자의 경우 
            this.loginNormal(this.user.isTodayApply, this.user.isTodayCheck)
            console.log('b',this.btn_apply)
        }
      }
    })


      // this.$http.post('/api/sasamo/event/today', {
      //   evt_seq : new_evt_seq
      // }, config)
      // .then(res =>{
      //   console.log('RESULT : ', res.data)
      //   // 로그인이 완료되면 오늘 이벤트에 사역신청 했는지 확인 
      //   this.user = res.data
      //   console.log('유저', this.user)
      //   if(this.user.ok){
      //     console.log("isToday? :", this.user.isTodayApply)
      //     // 로그인 성공 
      //     this.$store.commit("updateEvent", this.user.eventSeq) 
      //     if(this.user.leader != 'n'){
      //       // 팀장인 경우 
      //       this.loginLeader(this.user.isTodayApply, this.user.isTodayCheck)
      //       console.log('a',this.btn_apply)
      //   } else {
      //     // 일반 사역자의 경우 
      //       this.loginNormal(this.user.isTodayApply, this.user.isTodayCheck)
      //       console.log('b',this.btn_apply)
      //   }
      // }
      // })
    }

  },
  methods: {
    btnCheck() {
      console.log("SSSSSSS")
      switch(this.btn_check){
        case false : 
          console.log('user', this.user)
          this.check()
          this.btn_check = true
          break
        case true : 
          this.cancel()
          this.btn_check = false
          break
        default :
          alert("sadfsdfdsf")
      }
    },

    btnApply() {
      console.log("SSSSSSS", this.btn_apply)
      switch(this.btn_apply){
        case false : 
          console.log('sdflkjsadlkfjlksjdf')
          console.log('user', this.user)
          this.check()
          this.btn_apply = true
          console.log('출석은했나?',this.btn_apply)
          break
        case true : 
          this.cancel()
          this.btn_apply = false
          break
        default :
          alert("sadfsads;lfjasdflasjdlfjsdfldfdsf")
      }
      
    },
    // 출석체크가 y인 경우 체크해야함 

    loginLeader(isTodayApply, isTodayCheck){
      if (isTodayApply == 'y' && isTodayCheck == 'y') {
              // 팀장 이면서 사역신청 o 출석체크 o
              console.log('L : O/O')
              this.btn_apply = true
              this.btn_check = true
              this.btn_team = true
      } else if (isTodayApply === 'y' && isTodayCheck === 'n'){
              // 팀장이면서 신청 o 체크 x
              console.log('L : O/X')
              this.btn_apply = true
              this.btn_check = false
              this.btn_team = true
            } else {
              console.log('L : X/X')
              this.btn_apply = false
              this.btn_check = false
              this.btn_team = true
            }
    },
    loginNormal(isTodayApply, isTodayCheck){
      console.log('IS :', isTodayApply, isTodayCheck)
      if (isTodayApply == 'y' && isTodayCheck == 'y') {
              // 일반 이면서 사역신청 o 출석체크 o
              console.log('N : O/O')
              this.btn_apply = true
              this.btn_check = true
              this.btn_team = false
      } else if (isTodayApply === 'y' && isTodayCheck === 'n'){
              // 일반이면서 신청 o 체크 x
              console.log('N : O/X')
              this.btn_apply = true
              this.btn_check = false
              this.btn_team = false
            } else { // 일반 : 신청 x 체크 x
              console.log('N: X/X')
              this.btn_apply = false
              this.btn_check = false
              this.btn_team = false
            }
    },

    check() {
      let token = localStorage.getItem('access_token')
      console.log("LocalToken", token)
      let evt_seq = localStorage.getItem('Event')
    
    
    this.$http.post('/api/sasamo/check',  {
      evt_seq : evt_seq

    }, { headers: { 'access-token': token },  
    })
      .then((res) => {
        console.log('show', res)
        // alert('출석체크 완료!')
      }) 
  },
    cancel(){
      let token = localStorage.getItem('access_token')
      console.log("LocalToken", token)
      let evt_seq = localStorage.getItem('Event')

      this.$http.post('/api/sasamo/cancelCheck', {
        token: token,
        evt_seq : evt_seq
      })
       .then((res) => {
        console.log('사역신청 취소 완료')
        // alert('사역신청 취소 완료!')
      })
    },
    myTeamLeader() {
      console.log(this.user.leader, "sijdfilsf")
    
        this.$router.push({ name: 'sasamo_myteam_leader' })
      
    },
    myTeamUser() {
        this.$router.push({ name: 'sasamo_myteam_user' })
    },
    goBack() {
      this.$router.push({ name: 'sasamo'})
    }

    
},
}
</script>

