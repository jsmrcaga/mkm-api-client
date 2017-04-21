const fishingrod = require('fishingrod');
const percentencode = require('oauth-percent-encode');
const Crypto = require('crypto');
const utf8 = require('utf8');

var utils = {};
utils.debug = false;

// keys
	// !app_key
	// !secret
	// access_token_secret
	// access_token
utils.get = function(keys, path, data, headers, tokens){
	return utils.__mkmrequest(keys, 'GET', path, data, headers);
};

utils.post = function(keys, path, data, headers, tokens){
	return utils.__mkmrequest(keys, 'POST', path, data, headers);
};

utils.__mkmrequest = function(keys, method, path, data, headers, tokens){

	if(data){
		for(var k in data){
			if(typeof data[k] === 'string'){
				data[k] = data[k].replace(/\'/g, ' ');
			}
		}
	}

	if(tokens){
		keys.access_token = tokens.access_token;
		keys.access_token_secret = access_token_secret;
	}

	var oauth_header = getOauthHeader(method, path, {
		oauth_version : '1.0',
		oauth_timestamp: Math.round(Date.now() / 1000),
		oauth_nonce: generateNonce(),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_consumer_key: keys.app_key,
		oauth_token: keys.access_token || ''
	}, data, keys);
	if(!headers) {
		headers = {};
	}
	headers['Authorization'] = oauth_header;

	var params = {
		https: true,
		method: method,
		host: utils.debug ? 'sandbox.mkmapi.eu' : 'www.mkmapi.eu',
		path: path,
		headers:headers
	};
	if(data){
		params.data = data;
	}

	if(utils.debug){
		console.log('[MKM-API] Request', params);
	}

	return fishingrod.fish(params);
};

function getOauthHeader(method, path, params, data, keys){
	var header = `OAuth realm="${getUri(path)}",`;
	for(var k in params){
		header += k + '="' + params[k] +'",';
	}

	var signature = getSignature(method, path, params, data, keys);
	header += `oauth_signature="${signature}"`;
	return header;
}
utils.getOauthHeader = getOauthHeader;

function getUri(path){
	return 'https://' + (utils.debug ? 'sandbox.mkmapi.eu' : 'www.mkmapi.eu' ) + path;
}

function getSignature(method, path, params, data, keys){
	var str = getFinalString(method, path, params, data);
	var signing_key = getSigningKey(keys);

	const hmac = Crypto.createHmac('sha1', signing_key);
	hmac.update(str);
	var signature = hmac.digest('base64');
	return signature;
}
utils.getSignature = getSignature;

function getFinalString(method, path, params, data){
	var uri = getUri(path);
	var str = method + '&' + percentencode(uri) + '&';
	str += percentencode(buildParams(params, data));
	return str;
}
utils.getFinalString = getFinalString;

function getSigningKey(keys){
	return percentencode(keys.secret) + '&' + (keys.access_token_secret ? percentencode(keys.access_token_secret) : '');
}
utils.getSigningKey = getSigningKey;

function buildParams(params, data){
	params = makeParams(params, data);
	var str = [];
	for(var k in params){
		str.push(k + '=' + encodeURIComponent(params[k]));
	}
	str = str.join('&');
	return str;
}
utils.buildParams = buildParams;

function makeParams(params, data){
	const needed_params = ['version', 'timestamp', 'nonce', 'consumer_key', 'token', 'signature_method'];
	for(var k in data){
		params[k] = data[k];
	}
	params = sortObject(params);
	for(var k of needed_params){
		if(!(('oauth_' + k) in params)){
			params[('oauth_' + k)] = '';
		}
	}
	return params;
}

function sortObject(obj){
	var sorted = Object.keys(obj);
	sorted.sort(function(a, b){
		if(a > b) return 1;
		if(a < b) return -1;
		return 0;
	});
	var ret = {};
	for(var k of sorted){
		ret[k] = obj[k];
	}
	return ret;
}

function generateNonce(){
	function s4(){
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	return `${s4()}${s4()}${s4()}`;
}

module.exports = utils;