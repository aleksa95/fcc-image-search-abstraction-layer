'use strict';
/* global process.env.API_IMGUR */
const querystring = require('querystring');
var https = require('https');

/**
 * Fetches a page of results from the Imgur API.
 *
 * @param   {String}    q        Query
 * @param   {Number}    page     Index of the page of results
 * @param   {Function}  done             Callback that receives the parsed response
 */
module.exports = (q, page, done) => {
		var options = {
		  hostname: 'api.imgur.com',
		  path: `/3/gallery/search/time/top/${page}/?${querystring.stringify({q})}`,
		  headers: {'Authorization': `Client-ID ${process.env.API_IMGUR}`},
		  method: 'GET'
		};

		var req = https.request(options, (res) => {
		  	let body = '';
		    res.on('data', (chunk) => body += chunk );
		    res.on('end', () => done(null, JSON.parse(body)) );
		});
		req.on('error', (e) => done(e, null) );
		req.end();
};