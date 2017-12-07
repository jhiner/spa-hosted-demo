var webAuth = new auth0.WebAuth({
  domain:       AUTH0_DOMAIN,
  clientID:     AUTH0_CLIENT_ID,
  redirectUri:  AUTH0_CALLBACK_URL
});

$(document).ready(function() {

  // utility functions
  // clear local storage upon logout
  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    window.location.href = "/";
  };

  // app functionality
  // check hash for access_token, id_token
  webAuth.parseHash(window.location.hash, function(err, result) {
    console.log('handleParseHash');
    if (err) {
      console.log(JSON.stringify(err));
      console.log('error ' + err.error + ': ' + err.errorDescription);
      $('#msg').text(err.errorDescription);
      $('#msg').show();
    }

    if (result && result.idToken) {
      console.log('loading profile...');
      $('#login-form').hide();
      
      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('id_token', result.idToken);

      $('#idToken').text(result.idToken);
      $('#accessToken').text(result.accessToken);

      webAuth.client.userInfo(result.accessToken, function (err, profile) {
        console.log('userinfo result');
        console.log(profile);
        if (profile) {
          $('.nickname').text(profile.nickname);
          $('.avatar').attr('src', profile.picture).show();
        }
        $('#profile').show();
        $('#msg').hide();
        $('#index_content').hide();
      });

    } else if (result && result.error) {
      console.log('error: ' + result.error);
    }
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  });

  $('#btn-login').click(function(e) {
    e.preventDefault();
    $('#msg').text('Logging in. Please wait...');
    webAuth.authorize({
        redirectURI: AUTH0_CALLBACK_URL,
        responseType: 'id_token token',
        audience: 'http://todoapi2.api',
        scope: 'openid profile read:todo',
        prompt: 'consent'
      }, function (error, result) {
        $('#msg').text(error.error_description);
      });
  });

});
