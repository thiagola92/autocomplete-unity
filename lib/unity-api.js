'use babel';

import fetch from "node-fetch";
import fs from "fs";

async function getAPI() {
		let apiName = atom.config.get('autocomplete-unity.api').replace('.', '_') + '.json';
		let apiURL = "https://raw.githubusercontent.com/thiagola92/unity-scraping/master/API/" + apiName;

    let api;

		// create data folder
		if(fs.existsSync('data') == false)
			fs.mkdirSync('data');

    // get api from computer
    if(fs.existsSync(`data/${apiName}`) == true) {
			let file = fs.readFileSync(`data/${apiName}`, 'utf8');
      return JSON.parse(file);
		}

		// download api
		await fetch(apiURL)
			.then(res => res.json())
			.then(json => {
        api = json;
				json = JSON.stringify(json, null, 2);
        fs.writeFileSync(`data/${apiName}`, json, 'utf8');
      })
			.catch(error => {
        throw error
      });

    return await api;
}

exports.getAPI = getAPI;
