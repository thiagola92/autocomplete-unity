'use babel';

import fetch from "node-fetch";

class unityProvider {

	constructor() {
		let apiURL =
			"https://raw.githubusercontent.com/thiagola92/unity-scraping/master/API/" +
			atom.config.get('autocomplete-unity.api').replace('.', '_') + '.json';

		// data source is an array of objects
		fetch(apiURL)
			.then(res => res.json())
			.then(json => this.suggestions = json);

		// offer suggestions only when editing C# files
		// https://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/
		this.selector = '.source.cs';
	}

	getSuggestions(options) {
		const { editor, bufferPosition } = options;

		// getting the prefix on our own instead of using the one Atom provides
		let prefix = this.getPrefix(editor, bufferPosition);

		// only look for suggestions after 3 characters have been typed
		if (prefix.length >= 3) {
			return this.findMatchingSuggestions(prefix);
		}
	}

	getPrefix(editor, bufferPosition) {
		// the prefix normally only includes characters back to the last word break
		// which is problematic if your suggestions include punctuation (like ".")
		let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
		let match = line.match(/[\w\.]+$/);
		return match ? match[0] : '';
	}

	findMatchingSuggestions(prefix) {

		// filter list of suggestions to those matching the prefix, case insensitive
		let matchingSuggestions = this.suggestions.filter((suggestion) => {
			if(suggestion.text == null)
				return suggestion.snippet.toLowerCase().startsWith(prefix.toLowerCase());
			else
				return suggestion.text.toLowerCase().startsWith(prefix.toLowerCase());
		});

		// add replacemente prefix to each matching suggestion
		matchingSuggestions.map((suggestion) => {
			suggestion.replacementPrefix = prefix;
			return suggestion;
		});

		return matchingSuggestions;
	}

}
export default new unityProvider();
