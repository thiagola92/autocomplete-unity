'use babel';

import fetch from "node-fetch";
import fs from "fs";

async function getAPI() {
		let apiName = atom.config.get('autocomplete-unity.api').replace('.', '_') + '.json';
		let apiURL = "https://raw.githubusercontent.com/thiagola92/unity-scraping/master/API/" + apiName;
		let apiDirectory = atom.packages.resolvePackagePath('autocomplete-unity') + '/data';

		// create data folder
		if(fs.existsSync(apiDirectory) == false)
			fs.mkdirSync(apiDirectory);

    // get api from computer
    if(fs.existsSync(apiDirectory + `/${apiName}`) == true) {
			let file = fs.readFileSync(apiDirectory + `/${apiName}`, 'utf8');
      return JSON.parse(file);
		}

		// download api
    let api;
		await fetch(apiURL)
			.then(res => res.json())
			.then(json => {
        api = json;
				json = JSON.stringify(json, null, 2);
        fs.writeFileSync(apiDirectory + `/${apiName}`, json, 'utf8');
      })
			.catch(error => {
        throw error
      });

    return await api;
}

exports.getAPI = getAPI;
