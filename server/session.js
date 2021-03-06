var connection = require('./db').connection,
  Memcache = require('memcache'),
  email = require('./email').email,
  uuid = require('node-uuid'),
  config = require('./config').config;

function genSessionToken() {
  return uuid();
}

exports.create = function(uid, cb) {
  var sessionToken = genSessionToken();
  connection.query('INSERT INTO `sessions` (`uid`, `token`) VALUES (?, ?)', 
      [uid, sessionToken], function(err) {
    console.log('session '+sessionToken+' created for uid '+uid);
    cb(err, sessionToken);
  });
};

exports.getUid = function(sessionKey, cb) {
  console.log('looking up uid for sessionKey', sessionKey);
  connection.query('SELECT `uid` FROM `sessions` WHERE `token` = ?', [sessionKey], function(err, rows) {
    if(err) {
      cb(err);
    } else if(rows.length != 1) {
      cb('session not found for key');
    } else {
      cb(err, rows[0].uid);
    }
  });
};
    
