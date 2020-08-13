import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Booleans = suite('Boolean');

	Booleans('boolean', () => {
		const input = true;
		let output = klona(input);

		assert.deepEqual(input, output);

		output = false;
		assert.equal(input, true);
	});

	Booleans.run();
}
