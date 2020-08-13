import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Maps = suite('Map');

	Maps('flat', () => {
		const input = new Map();
		const output = klona(input);

		assert.deepEqual(input, output);

		output.set('hello', 'world');
		assert.equal(input.get('hello'), undefined);

		input.set('foo', 'bar');
		assert.equal(output.get('foo'), undefined);
	});

	Maps('nested', () => {
		const input = new Map([
			['foo', { a: 1 }],
			['bar', [1, 2, 3]],
		]);
		const output = klona(input);

		const foo = output.get('foo');
		foo.b = 2;
		foo.a++;

		assert.deepEqual(input.get('foo'), { a: 1 });
		assert.deepEqual(output.get('foo'), { a: 2, b: 2 });

		output.get('bar').push(4, 5, 6);
		assert.deepEqual(input.get('bar'), [1, 2, 3]);
		assert.deepEqual(output.get('bar'), [1, 2, 3, 4, 5, 6]);
	});

	Maps('nested :: keys', () => {
		const input = new Map([
			[{ foo:1 }, { a: 1 }]
		]);

		const output = klona(input);
		assert.deepEqual(input, output);

		[...output.keys()][0].bar = 2;

		assert.deepEqual([...input.keys()][0], { foo:1 });
		assert.deepEqual([...output.keys()][0], { foo:1, bar:2 });
	});

	Maps.run();
}
