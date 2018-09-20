var superagent = require('superagent');
var config = require('../config-dev.json');
var url = config.url_base;
const backendURL = config.url_backend

module.exports = {
  getTokenFirstTime: function (code, cb) {
    url += config.url_token;
    var data = {
      "grant_type": "authorization_code",
      "code": code,
      "client_id": config.client_id,
      "client_secret": config.client_secret,
      "redirect_uri": config.url_redirect
    }

    superagent
      .post(url)
      .send(data)
      .end(function (err, res) {
        res = res.body
        console.log("RES")
        console.log(res)
        if (!err && ("status" in res && res.status == 'OK')) {
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
    url += config.url_token;
    var data = {
      "grant_type": "refresh_token",
      "refresh_token": window.localStorage.refresh_token,
      "client_id": config.client_id,
      "client_secret": config.client_secret
    }

    superagent
      .post(url)
      .send(data)
      .end(function (err, res) {
        res = res.body;
        if ("status" in res && res.status == 'OK') {
          var data = res.result.data;
          window.localStorage.setItem('access_token', data.access_token);
          window.localStorage.setItem('refresh_token', data.refresh_token);
        }
        else {
          console.log('Error: ', res)
          module.exports.logout();
        }
      });
  },

  getSecureRequest: function (url, token, cb) {
    superagent
      .get(url)
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        if (!err) {
          var data = res.body;
          console.log("data:")
          console.log(data)
          if (!err) {
            if ('status' in data) {
              if (data.status == 'OK') {
                if ('content' in data.result.data)
                  cb(false, data.result.data.content);
                else
                  cb(true, data.result.data.message);
              }
              else {
                cb(true, data.result.errors[0]);
              }
            }
          }
          else {
            cb(true, err);
          }
        }
        else {
          console.log('err: ', err);
          cb(err);
        }
      });
  },

  getRequest: function (url, cb) {
    superagent
      .get(url)
      .end(function (err, res) {
        console.log("HERE")
        console.log(err)
        console.log(res)
        if (err) {
          if (res) cb(true, res.text);
          else cb(true, err);
        }
        else cb(false, res.body);
      });
  },

  postRequest: function (url, data, cb) {
    superagent
      .post(url)
      .send(data)
      .end(function (err, res) {
        if (err) {
          if (res) cb(true, res.text);
          else cb(true, err);
        }
        else cb(false, res);
      });
  },

  checkLocalStorage: function (cb) {
    function check() {
      var test = 'test';
      try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        cb(true);
      } catch (e) {
        cb(false);
      }
    }

    check();
  },

  moveTo: function (to) {
    window.location = to;
  },

  logout: function () {
    window.localStorage.clear();
    module.exports.moveTo('/');
  }
};
