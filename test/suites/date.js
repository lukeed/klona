import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Dates = suite('Date');

	Dates('date', () => {
		const input = new Date;
		const output = klona(input);
		const original = input.toString();

		assert.deepEqual(input, output);

		output.setDate('foobar123');
		assert.equal(output.toString(), 'Invalid Date');
		assert.equal(input.toString(), original);
	});

	Dates.run();
}
