<template lang="html">

<h1>로그인 페이지입니다.</h1>
<p>{{ this.$route.params.id }}
{{ id }}</p>

</template>

<script>
export default {
  created: function () {
    var id = this.$route.params.id
    console.log(id, "askjdlskj")
    this.id = id
  },
  data: function () {
    return {
      id : this.$route.params.id
    }
  }
}
</script>
