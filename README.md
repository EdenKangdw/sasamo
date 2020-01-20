### 사사모 프로젝트

backend : node + express 
frontend : vue.js + bootstrap
db : mariaDB

참고 : https://m.blog.naver.com/kangminser88/221146020394

# 1. 설치 
이 프로젝트는 기본적으로 node를 사용하고 있어, node를 설치해야 합니다. (https://nodejs.org/en/)
node는 위 링크를 통해 설치하시기 바랍니다. 그리고 git clone은 필수입니다. 
```
npm install 
```
을 통해 각종 패키지들을 설치해줍니다. 

# 2. 환경설정 - DB연결
DB연결을 위해 backend/model/db 폴더에 갑니다.
db_conn.js에서 아래의 설정을 바꾸어 각각 local DB와 heroku DB에 연결합니다. 
```node 
var config = require('../db/db_info').local;
var config = require('../db/db_info').heroku;
```

# 3. 실행 
sasamo 폴더 안에 보면 frontend, backend 폴더가 있습니다. 아래 명령어를 통해 프론트와 백엔드를 각각 실행합니다. 그 후 localhost:8080에 가시면 끝.
```
cd frontend
npm start
```

```
cd backend
npm start
``` 

