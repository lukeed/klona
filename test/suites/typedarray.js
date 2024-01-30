import { suite } from 'uvu';
// import * as assert from 'uvu/assert';
import * as assert from 'assert';

export default function(klona) {
	const test = suite('TypedArray');

	test('Buffer', () => {
		const input = Buffer.from('asd');
		const output = klona(input);

		assert.deepEqual(input, output);

		output.write('foobar');
		assert.equal(input.toString(), 'asd');

		output[1] = 11;
		assert.notEqual(input[1], output[1]);

		const current = output.toString();
		input.write('hello');
		assert.equal(output.toString(), current);
	});

	test('Int16Array', () => {
		const input = new Int16Array([42]);
		const output = klona(input);

		assert.deepEqual(input, output);

		output[1] = 42;
		assert.equal(input[1], undefined);

		input[0] = 0;
		assert.equal(output[0], 42);
	});

	test('Int32Array', () => {
		const buf = new ArrayBuffer(8);
		const input = new Int32Array(buf);
		const output = klona(input);

		assert.deepEqual(input, new Int32Array([0, 0]));
		assert.deepEqual(output, new Int32Array([0, 0]));
		assert.deepEqual(input, output);

		output[1] = 42;
		assert.equal(input[1], 0);

		input[0] = 22;
		assert.equal(output[0], 0);
	});

	test('Int32Array', () => {
		const buf = new ArrayBuffer(8);
		const input = new Int32Array(buf);
		const output = klona(input);

		assert.deepEqual(input, new Int32Array([0, 0]));
		assert.deepEqual(output, new Int32Array([0, 0]));
		assert.deepEqual(input, output);

		output[1] = 42;
		assert.equal(input[1], 0);

		input[0] = 22;
		assert.equal(output[0], 0);
	});

	test('ArrayBuffer :: empty', () => {
		const input = new ArrayBuffer(6);
		const output = klona(input);

		assert.deepEqual(input, output);

		const view1 = new DataView(input);
		const view2 = new DataView(output);

		view1.setInt8(0, 4);
		assert.equal(view1.getInt8(0), 4);
		assert.equal(view2.getInt8(0), 0);

		view2.setInt8(1, 8);
		assert.equal(view1.getInt8(1), 0);
		assert.equal(view2.getInt8(1), 8);
	});

	test('ArrayBuffer :: values', () => {
		const input = new ArrayBuffer(3);
		const view1 = new DataView(input);

		view1.setInt8(0, 4);
		view1.setInt8(1, 5);
		view1.setInt8(2, 6);

		const output = klona(input);
		const view2 = new DataView(output);

		assert.deepEqual(input, output);

		assert.equal(view2.getInt8(0), 4);
		assert.equal(view2.getInt8(1), 5);
		assert.equal(view2.getInt8(2), 6);
	});

	test('DataView', () => {
		const ints = new Int8Array([1, 2, 3]);
		const input = new DataView(ints.buffer);
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.deepEqual(input.buffer, output.buffer);

		input.setInt8(1, 6);
		assert.equal(ints[1], 6);
		assert.equal(input.getInt8(1), 6);
		assert.equal(output.getInt8(1), 2);

		output.setInt8(0, 4);
		assert.equal(ints[0], 1);
		assert.equal(input.getInt8(0), 1);
		assert.equal(output.getInt8(0), 4);
	});

	test.run();
}
