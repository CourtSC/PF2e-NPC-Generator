// https://www.wiktionary.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:English_given_names&cmlimit=500

import { writeFile } from 'fs';

const endpoint =
	'https://www.wiktionary.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:English_female_given_names&cmlimit=500';

async function getData(endpoint) {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
	try {
		const response = await fetch(endpoint, {
			method: 'GET',
			rejectUnauthorized: false,
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const responseJSON = await response.json();
		console.log(responseJSON);

		const nameArr = [];
		for (const name of responseJSON.query.categorymembers) {
			nameArr.push(name.title);
		}

		if (responseJSON?.continue?.cmcontinue) {
			console.log(responseJSON.continue.cmcontinue);
			const continueArray = await handleContinue(
				responseJSON.continue.cmcontinue
			);
			const concatArray = nameArr.concat(continueArray);
			return concatArray;
		}

		return nameArr;
	} catch (error) {
		console.error(error);
	}
}

function handleContinue(cmcontinue) {
	return getData(endpoint + `&cmcontinue=${cmcontinue}`);
}

const nameData = await getData(endpoint);

const obj = {
	female: nameData,
};
const json = JSON.stringify(obj);
writeFile('data/femaleNames.json', json, (err) => {
	if (err) {
		console.log(err);
	} else {
		// File written successfully.
	}
});
