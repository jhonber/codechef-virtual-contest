var superagent = require('superagent');

module.exports = {
  getToken: function (cb) {
    var url = 'https://api.codechef.com/oauth/token'
    var data = {
      "grant_type": "client_credentials",
      "scope": "public",
      "client_id": "b86af1a43aec2c15b66cda4bae1e229c",
      "client_secret": "f22381d658eb435acc75cd828053a557",
      "redirect_uri": ""
    }

    superagent
      .post(url)
      .send(data)
      .end(function (err, res) {
        res = res.body
        if ("status" in res && res.status == 'OK') {
          cb(false, res.result.data.access_token);
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
        var data = res.body;
        console.log("HERE")
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
      });
  }
};