import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Sets = suite('Set');

	Sets('flat', () => {
		const input = new Set('hello');
		const output = klona(input);

		assert.deepEqual(input, output);

		output.add('world');
		assert.equal(input.has('world'), false);

		input.add('foobar');
		assert.equal(output.has('foobar'), false);
	});

	Sets('nested', () => {
		const input = new Set([{ foo: 123 }]);
		const output = klona(input);

		assert.deepEqual(input, output);

		const [obj] = [...output.keys()];
		obj.bar = 456;
		obj.foo++;

		const [item] = [...input.keys()];
		assert.deepEqual(item, { foo: 123 });
	});

	Sets.run();
}
