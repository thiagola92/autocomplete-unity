'use babel';

// data source is an array of objects
import suggestions from '../data/unity_api';

class unityProvider {
	constructor() {
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
		prefix = prefix.toLowerCase();

		let matchingSuggestions = suggestions.filter((suggestion) => {
			if(suggestion.text == null)
				return suggestion.snippet.toLowerCase().startsWith(prefix);

			return suggestion.text.toLowerCase().startsWith(prefix);
		});

		// run each matching suggestion through inflateSuggestion() and return
		return matchingSuggestions.map(this.inflateSuggestion);
	}

	// clones a suggestion object to a new object with some shared additions
	// cloning also fixes an issue where selecting a suggestion won't insert it
	inflateSuggestion(suggestion) {
		if(suggestion.text == null)
			return {
				snippet: suggestion.snippet,
				displayText: suggestion.displayText,
				type: suggestion.type,
				description: suggestion.description,
				descriptionMoreURL: suggestion.descriptionMoreURL,
			}

		return {
			text: suggestion.text,
			type: suggestion.type,
			description: suggestion.description,
			descriptionMoreURL: suggestion.descriptionMoreURL,
		};
	}
}
export default new unityProvider();
