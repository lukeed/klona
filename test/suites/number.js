import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Numbers = suite('Number');

	Numbers('number', () => {
		let input = 123;
		let output = klona(input);

		assert.deepEqual(input, output);

		output++;
		assert.equal(input, 123);

		input += 100;
		assert.equal(output, 124);
	});

	Numbers.run();
}
