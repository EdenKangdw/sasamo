module.exports = (function () {
    return {
      local: { // localhost
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1111',
        database: 'sasamo'
      },
      heroku: { // real server db info
        host: 'if0ck476y7axojpg.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        port: '3306',
        user: 'hrttsqf24b6bas1o',
        password: 'ope0pbfbnv7kz7lk',
        database: 'tzre4ghk21h8egjz'
      },
      dev: { // dev server db info
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
      }
    }
  })();