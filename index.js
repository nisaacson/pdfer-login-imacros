/**
 * Login to pdfer website using iMacros for Firefox
 */
module.exports = function(config, cb) {
  // clear all existing cookies and sessions

  if (!config) {
    return cb('"config" parameter missing');
  }
  var uploadURL = 'http://'+config.pdfer.host + ':' + config.pdfer.port + '/upload';
  var code = iimPlay('CODE:URL GOTO='+uploadURL);
  var atPage = atUploadPage();
  if (atPage) {
    var username = getUsername();
    if (username === config.pdfer.username) {
      iimDisplay('login already done');
      return cb();
    }
  }

  var loginURL = 'http://'+config.pdfer.host + ':' + config.pdfer.port + '/login';
  code = iimPlay('CODE:URL GOTO='+loginURL);
  if (code !==1) {
    return cb('failed to login to pdfer service, imacros error: ' + iimGetLastError());
  }
  atPage = atLoginPage();
  if (!atPage) {
    var logoutURL = 'http://'+config.pdfer.host + ':' + config.pdfer.port + '/logout';
    code = iimPlay('CODE:URL GOTO=' +logoutURL);
    code = iimPlay('CODE:URL GOTO='+loginURL);
    atPage = atLoginPage();
    if (!atPage) {
      return cb('not at login page when we should be');
    }
  }
  fillLogin(config, function (err, reply) {
    if (err) { return cb(err); }
    atPage = atUploadPage();
    if (!atPage) {
      return cb('pdfer login failed, not at upload page after submitting login');
    }
    cb();
  });
}


function getUsername() {
  var code = iimPlay('CODE: TAG POS=1 TYPE=SPAN ATTR=ID:username EXTRACT=TXT');
  if (code !== 1) {
    return null;
  }
  var extract = iimGetLastExtract().trim();
  if (extract === '#EANF#') {
    return null;
  }
  return extract;
}
function fillLogin(config, cb) {
  var code = iimPlay('CODE: SET !TIMEOUT_TAG 0\n'
                     + 'TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:NoFormName ATTR=ID:id_username CONTENT='+config.pdfer.username);
  if (code !== 1) {
    return cb('login failed, imacros error when filling in username field: ' + iimGetLastError());
  }

  code = iimPlay('CODE: SET !TIMEOUT_TAG 0\n'
                 + 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=NAME:NoFormName ATTR=ID:id_password CONTENT='+config.pdfer.password);
  if (code !== 1) {
    return cb('login failed, imacros error when filling in password field: ' + iimGetLastError());
  }
  code = iimPlay('CODE:SET !TIMEOUT_TAG 0\n'
                 + 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:NoFormName ATTR=*')
  if (code !== 1) {
    return cb('login failed, imacros error when pressing submit button on login page: ' + iimGetLastError());
  }
  cb();
}
function atLoginPage() {
  var code = iimPlay('CODE: SET !TIMEOUT_TAG 0\n'
                     + 'TAG POS=1 TYPE=LEGEND ATTR=TXT:Login');
  if (code === 1) {
    return true;
  }
  return false;
}

function atUploadPage() {
  var code = iimPlay('CODE:SET !TIMEOUT_TAG 0\n'
                     + 'TAG POS=1 TYPE=H1 ATTR=TXT:Upload<SP>PDF');
  if (code === 1) {
    return true;
  }
  return false;
}