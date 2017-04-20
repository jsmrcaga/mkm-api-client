const MkmClient = require('../mkm.js');
const percentencode = require('oauth-percent-encode');

const expect = require('chai').expect;

const Client = new MkmClient();

var params = {
	oauth_version : '1.0',
	oauth_timestamp: 1407917892,
	oauth_nonce: '53eb1f44909d6',
	oauth_signature_method: 'HMAC-SHA1',
	oauth_consumer_key: 'bfaD9xOU0SXBhtBP',
	oauth_token: 'lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q'
};

describe('Return tests', function(){
	it('Should build params like in the docs', function(){
		expect(percentencode(Client.__utils.buildParams(params))).to.be.eql('oauth_consumer_key%3DbfaD9xOU0SXBhtBP%26oauth_nonce%3D53eb1f44909d6%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1407917892%26oauth_token%3DlBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q%26oauth_version%3D1.0');
	});

	it('Should get correct signing key', function(){
		expect(Client.__utils.getSigningKey({
			secret: 'pChvrpp6AEOEwxBIIUBOvWcRG3X9xL4Y',
			access_token_secret: 'hc1wJAOX02pGGJK2uAv1ZOiwS7I9Tpoe'
		})).to.be.eql('pChvrpp6AEOEwxBIIUBOvWcRG3X9xL4Y&hc1wJAOX02pGGJK2uAv1ZOiwS7I9Tpoe');
	});

	it('Should get correct signing key without access_token_secret', function(){
		expect(Client.__utils.getSigningKey({
			secret: 'pChvrpp6AEOEwxBIIUBOvWcRG3X9xL4Y'
		})).to.be.eql('pChvrpp6AEOEwxBIIUBOvWcRG3X9xL4Y&');
	});

	it('Should get final string', function(){
		expect(Client.__utils.getFinalString('GET','/ws/v1.1/account', params)).to.be.eql('GET&https%3A%2F%2Fwww.mkmapi.eu%2Fws%2Fv1.1%2Faccount&oauth_consumer_key%3DbfaD9xOU0SXBhtBP%26oauth_nonce%3D53eb1f44909d6%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1407917892%26oauth_token%3DlBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q%26oauth_version%3D1.0');
	});

	it('Should get correct signature from API Docs', function(){
		var signature = Client.__utils.getSignature('GET', '/ws/v1.1/account', params, {
			app_key: 'bfaD9xOU0SXBhtBP',
			secret: 'pChvrpp6AEOEwxBIIUBOvWcRG3X9xL4Y',
			access_token: 'lBY1xptUJ7ZJSK01x4fNwzw8kAe5b10Q',
			access_token_secret: 'hc1wJAOX02pGGJK2uAv1ZOiwS7I9Tpoe'
		});

		expect(signature).to.be.eql('DLGHHYV9OsbB/ARf73psEYaNWkI=');
	});
});