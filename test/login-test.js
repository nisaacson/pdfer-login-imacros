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
  var filePath = 'file:///users/noah/src/node/pdfer-imacros/pdfer-login-imacros/test/localConfig.json'
  loadConfigFile(filePath, function (err, config) {
    should.not.exist(err, 'error loading config file')
    login(config, cb);
  });
}

function loadConfigFile(filePath, cb) {
  readFile(filePath, function (err, reply) {
    if (err) { return cb(err); }
    var data = JSON.parse(reply);
    cb(null, data);
  });
}
