<template lang="html">
<div id="app">
    <h1>로그인을 해주세요</h1>
    <form method="get" action="/login" id="loginForm">
        <table id="login">
            <tr>
                <td>ID</td>
                <td><input type="text" value="ssm_id"></td>
            </tr>
            <tr>
                <td>비밀번호</td>
                <td><input type="password" value="ssm_pw"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <input type="submit" value="login">
                    <input type="button" value="회원가입">
                </td>
            </tr>
        </table>
    </form>
</div>
        
</template>

<script>
export default {
    
}
</script>

<style scope lang="css">

#loginForm {
    align: center;
    width: 33%;
    margin-left: 33%;
}

#login {
    margin-left: 10%;
}


</style>