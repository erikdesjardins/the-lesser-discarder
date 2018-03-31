'use strict';

const fs = require('fs');
const path = require('path');
const deployChrome = require('chrome-extension-deploy');

deployChrome({
	clientId: process.env.CHROME_CLIENT_ID,
	clientSecret: process.env.CHROME_CLIENT_SECRET,
	refreshToken: process.env.CHROME_REFRESH_TOKEN,
	id: 'eihhlkhhliimeoekbacdagapnimpjpic',
	zip: fs.readFileSync(path.join(__dirname, 'dist/TLD.zip'))
}).then(function() {
	console.log('Chrome deploy complete!');
}, function(err) {
	console.error('Chrome failed:', err);
	process.exitCode = 1;
});
