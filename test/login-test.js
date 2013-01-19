var should = require('should');
var readFile = require('imacros-read-file');
var login = require('../index');
runTests(function (err, reply) {
  if (err) {
    alert('check test suite fails with error: ' + JSON.stringify(err));
    return false;
  }
  iimDisplay('Success! Checks test suite passes');
});

function runTests(cb) {
  iimDisplay('running login tests');
  var filePath = 'file:///users/noah/src/node/pdfer-imacros/pdfer-login-imacros/test/localConfig.json'
  loadConfigFile(filePath, function (err, config) {
    if (err) { return cb(err); }
    login(config, function (err, reply) {
      if (err) { return cb(err); }
      login(config, cb);
    });
  });
}

function loadConfigFile(filePath, cb) {
  readFile(filePath, function (err, reply) {
    if (err) { return cb(err); }
    var data = JSON.parse(reply);
    cb(null, data);
  });
}
