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

MkmApiClient.prototype.get = function(path, data, headers, tokens){
	return this.__utils.get({
		app_key: this.app_key,
		secret: this.app_secret,
		access_token: this.access_token || undefined,
		access_token_secret: this.access_token_secret || undefined
	}, path, data, headers, tokens);
};

MkmApiClient.prototype.post = function(path, data, headers, tokens){
	return this.__utils.post({
		app_key: this.app_key,
		secret: this.app_secret,
		access_token: this.access_token || undefined,
		access_token_secret: this.access_token_secret || undefined
	}, path, data, headers, tokens);
};

MkmApiClient.prototype.request = function(method, path, data, headers, tokens){
	return this.__utils.__mkmrequest({
		app_key: this.app_key,
		secret: this.app_secret,
		access_token: this.access_token || undefined,
		access_token_secret: this.access_token_secret || undefined
	}, method, path, data, headers, tokens);
};

MkmApiClient.prototype.setAccessTokens = function(access_token, access_token_secret){
	this.access_token = access_token;
	this.access_token_secret = access_token_secret;
};

module.exports = MkmApiClient;