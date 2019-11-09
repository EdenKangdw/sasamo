module.exports = (function () {
    return {
      local: { // localhost
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1111',
        database: 'sasamo'
      },
      real: { // real server db info
        host: '',
        port: '',
        user: '',
        password: '!',
        database: ''
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