var superagent = require('superagent');
var config = require('../config.json');
var url = config.url_base;

module.exports = {
  getTokenFirstTime: function (code, cb) {
    url += config.url_token;
    var data = {
      "grant_type": "authorization_code",
      "code": code,
      "client_id": config.client_id,
      "client_secret": config.client_secret,
      "redirect_uri": config.url_redirect_dev
    }

    superagent
      .post(url)
      .send(data)
      .end(function (err, res) {
        res = res.body
        console.log("RES")
        console.log(res)
        if ("status" in res && res.status == 'OK') {
          cb(false, res.result.data);
        }
        else {
          console.log('Error: ', res)
          cb(true);
        }
      });
  },

  refreshToken: function (cb) {
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
          cb(false, res.result.data);
        }
        else {
          console.log('Error: ', res)
          cb(true);
        }
      });
  },

  getContestsList: function (url, token, cb) {
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
                cb(false, data.result.data.content);
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
  }
};