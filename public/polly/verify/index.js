var token = 'ACCESS_TOKEN'

var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var pem = jwkToPem(token);
jwt.verify(token, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {
    console.log('decodedToken', decodedToken)
});