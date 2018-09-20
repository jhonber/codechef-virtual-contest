var superagent = require('superagent')
var config = require('../config-dev.json')
const url = config.urlBase
const backendURL = config.urlBackend

module.exports = {
  getTokenFirstTime: function (code, cb) {
    const tokenURL = url + config.urlToken
    var data = {
      'grant_type': 'authorization_code',
      'code': code,
      'client_id': config.clientID,
      'client_secret': config.clientSecret,
      'redirect_uri': config.urlRedirect
    }

    superagent
      .post(tokenURL)
      .send(data)
      .end(function (err, res) {
        res = res.body
        console.log('RES')
        console.log(res)
        if (!err && ('status' in res && res.status === 'OK')) {
          console.log(`${backendURL}/auth/login`)
          superagent
            .post(`${backendURL}/auth/login`)
            .send(res.result.data)
            .end(function (err, res) {
              if (err) return cb(err)
              cb(null, res.body)
            })
        } else {
          console.log('Error: ', res)
          cb(res.result.errors.message)
        }
      })
  },

  refreshToken: function () {
    const tokenURL = url + config.urlToken
    var data = {
      'grant_type': 'refresh_token',
      'refresh_token': window.localStorage.refresh_token,
      'client_id': config.clientID,
      'client_secret': config.clientSecret
    }

    superagent
      .post(tokenURL)
      .send(data)
      .end(function (err, res) {
        res = res.body
        if (!err && ('status' in res && res.status === 'OK')) {
          var data = res.result.data
          window.localStorage.setItem('access_token', data.access_token)
          window.localStorage.setItem('refresh_token', data.refresh_token)
        } else {
          console.log('Error: ', err, res)
          module.exports.logout()
        }
      })
  },

  getSecureRequest: function (url, token, cb) {
    superagent
      .get(url)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        console.log('RESPONSE', err, res.body)
        if (!err) {
          var data = res.body
          console.log('data:', data)
          if (!err) {
            if ('status' in data) {
              if (data.status === 'OK') {
                if ('content' in data.result.data) { cb(null, data.result.data.content) } else { cb(data.result.data.message) }
              } else {
                cb(data.result.errors[0])
              }
            }
          } else {
            cb(err)
          }
        } else {
          console.log('err: ', err)
          cb(err)
        }
      })
  },

  getRequest: function (url, cb) {
    superagent
      .get(url)
      .end(function (err, res) {
        console.log('HERE')
        console.log(err)
        console.log(res)
        if (err) {
          if (res) cb(res.text)
          else cb(err)
        } else cb(null, res.body)
      })
  },

  postRequest: function (url, data, cb) {
    superagent
      .post(url)
      .send(data)
      .end(function (err, res) {
        if (err) {
          if (res) cb(res.text)
          else cb(err)
        } else cb(null, res)
      })
  },

  checkLocalStorage: function (cb) {
    function check () {
      var test = 'test'
      try {
        window.localStorage.setItem(test, test)
        window.localStorage.removeItem(test)
        cb()
      } catch (e) {
        cb(e)
      }
    }
    check()
  },

  moveTo: function (to) {
    window.location = to
  },

  logout: function () {
    window.localStorage.clear()
    module.exports.moveTo('/')
  }
}
