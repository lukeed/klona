import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Spoofed = suite('Symbol.toStringTag spoofing');

	// A `Symbol.toStringTag` klona special-cases (eg "Map") used to misroute a
	// plain object into that branch and crash.
	// @see https://github.com/lukeed/klona/issues/54
	Spoofed('recognized tag :: plain object is cloned, not misrouted', () => {
		const input = { a: 1, b: { c: 2 }, [Symbol.toStringTag]: 'Map' };
		const output = klona(input);

		assert.notEqual(output, input, 'must return a new object, not the input');
		assert.equal(output.a, 1);
		assert.deepEqual(output.b, { c: 2 });

		output.a = 999;
		output.b.c = 888;
		assert.equal(input.a, 1, 'mutating output.a must not affect input');
		assert.equal(input.b.c, 2, 'mutating output.b must not affect input');
	});

	// An unrecognized `Symbol.toStringTag` used to fall through every branch
	// and be returned by reference instead of cloned.
	// @see https://github.com/lukeed/klona/issues/54
	Spoofed('unrecognized tag :: plain object is cloned, not returned by reference', () => {
		const input = { a: 1, b: { c: 2 }, [Symbol.toStringTag]: 'Foobar' };
		const output = klona(input);

		assert.notEqual(output, input, 'must return a new object, not the input');
		assert.equal(output.a, 1);
		assert.deepEqual(output.b, { c: 2 });

		output.a = 999;
		output.b.c = 888;
		assert.equal(input.a, 1, 'mutating output.a must not affect input');
		assert.equal(input.b.c, 2, 'mutating output.b must not affect input');
	});

	Spoofed.run();
}
