import { suite } from 'uvu';
import * as assert from 'uvu/assert';

export default function (klona) {
	const API = suite('exports');

	API('should export a function', () => {
		assert.type(klona, 'function');
	});

	API.run();
}
