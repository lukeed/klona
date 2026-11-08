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

	Dates('overridden valueOf', () => {
		class SecondsDate extends Date {
			valueOf() {
				return Math.floor(this.getTime() / 1000);
			}
		}

		const input = new SecondsDate('2024-06-15T12:34:56.789Z');
		const output = klona(input);

		assert.notStrictEqual(output, input);
		assert.equal(output.getTime(), 1718454896789);

		output.setTime(0);
		assert.equal(input.getTime(), 1718454896789);
	});

	Dates('invalid date with overridden valueOf', () => {
		class InvalidDate extends Date {
			valueOf() {
				return 0;
			}
		}

		const input = new InvalidDate(NaN);
		const output = klona(input);

		assert.notStrictEqual(output, input);
		assert.equal(Number.isNaN(output.getTime()), true);
	});

	Dates('does not invoke valueOf', () => {
		const input = new Date(123);
		input.valueOf = () => {
			throw new Error('Date cloning must not invoke valueOf');
		};

		const output = klona(input);

		assert.notStrictEqual(output, input);
		assert.equal(output.getTime(), 123);
		assert.equal(input.getTime(), 123);
	});

	Dates.run();
}
