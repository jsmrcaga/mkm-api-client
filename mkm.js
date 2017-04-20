var api = {};

function MkmApiClient(key, secret){
	this.app_key = key;
	this.app_secret = secret;
	
	this.__utils = require('./utils/utils.js');
}

MkmApiClient.prototype.debug = function(){
	this.__utils.debug = !this.__utils.debug;
	return this.__utils.debug;
};

MkmApiClient.prototype.get = function(path, data, oauth_token, headers){
	return this.__utils.get({
		app_key: this.app_key,
		secret: this.app_secret,
		access_token: this.access_token || undefined
	}, path, data, oauth_token, headers);
};

MkmApiClient.prototype.post = function(path, data, oauth_token, headers){
	return this.__utils.post({
		app_key: this.app_key,
		secret: this.app_secret,
		access_token: this.access_token || undefined
	}, path, data, oauth_token, headers);
};

MkmApiClient.prototype.request = function(method, path, data, oauth_token, headers){
	return this.__utils.__mkmrequest({
		app_key: this.app_key,
		secret: this.app_secret,
		access_token: this.access_token || undefined
	}, method, path, data, oauth_token, headers);
};

module.exports = MkmApiClient;