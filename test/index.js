import test from 'tape';
import klona from '../src';

test('exports', t => {
	t.is(typeof klona, 'function', 'exports a function');
	t.end();
});


test('array :: flat', t => {
	const input = ['foo', 'bar', 'baz'];
	const output = klona(input);

	t.deepEqual(input, output);

	output[1] = 'hello';
	t.not(input[1], 'hello');

	t.end();
});


test('array :: nested', t => {
	const input = ['foo', [1, 2, ['hello', 'world'], 3], 'bar', 'baz'];
	const output = klona(input);

	t.deepEqual(input, output);

	output[1][2][0] = 'howdy';
	t.is(input[1][2][0], 'hello');

	output[1] = 'hello';
	t.not(input[1], 'hello');

	t.end();
});


test('boolean', t => {
	const input = true;
	let output = klona(input);

	t.deepEqual(input, output);

	output = false;
	t.is(input, true);

	t.end();
});


test('date', t => {
	const input = new Date;
	const output = klona(input);
	const original = input.toString();

	t.deepEqual(input, output);

	output.setDate('foobar123');
	t.is(output.toString(), 'Invalid Date');
	t.is(input.toString(), original);

	t.end();
});


test('function', t => {
	let input = () => {};
	let output = klona(input);
	let original = input.toString();

	t.deepEqual(input, output);

	input = () => 123;
	t.is(output.toString(), original);

	output = () => 456;
	t.is(input.toString(), '() => 123');

	t.end();
});


test('map', t => {
	const input = new Map();
	const output = klona(input);

	t.deepEqual(input, output);

	output.set('hello', 'world');
	t.is(input.get('hello'), undefined);

	input.set('foo', 'bar');
	t.is(output.get('foo'), undefined);

	t.end();
});



test('number', t => {
	let input = 123;
	let output = klona(input);

	t.deepEqual(input, output);

	output++;
	t.is(input, 123);

	input += 100;
	t.is(output, 124);

	t.end();
});


test('object :: flat', t => {
	const input = { foo:1, bar:2, baz:3 };
	const output = klona(input);

	t.deepEqual(input, output);

	output.foo++;
	t.is(input.foo, 1);

	output.bar = 'hello';
	t.is(input.bar, 2);

	t.end();
});


test('object :: nested', t => {
	const input = {
		foo: 1,
		bar: {
			a: 2,
			b: ['hello', 'world'],
			c: [{ hello: 1, world: 2 }]
		},
		baz: 3
	};

	const output = klona(input);

	t.deepEqual(
		JSON.stringify(input),
		JSON.stringify(output)
	);

	output.bar.a = 11;
	t.is(input.bar.a, 2);

	output.bar.b[1] = 'mundo';
	t.is(input.bar.b[1], 'world');

	output.bar.c[0].hello = 99;
	t.is(input.bar.c[0].hello, 1);

	t.end();
});


test('regexp :: basic', t => {
	const input = /foo/gi;
	const output = klona(input);

	t.deepEqual(input, output);

	output.exec('foofoofoo');
	t.is(output.lastIndex, 3);
	t.is(input.lastIndex, 0);

	t.end();
});


test('regexp :: state', t => {
	const input = /foo/gi;
	input.exec('foofoofoo');
	const index = input.lastIndex;

	const output = klona(input);

	t.deepEqual(input, output);

	t.is(index, 3);
	t.is(input.lastIndex, index);
	t.is(output.lastIndex, index);

	t.end();
});


test('set', t => {
	const input = new Set('hello');
	const output = klona(input);

	t.deepEqual(input, output);

	output.add('world');
	t.false(input.has('world'));

	input.add('foobar');
	t.false(output.has('foobar'));

	t.end();
});


test('string', t => {
	let input = 'hello';
	let output = klona(input);

	t.deepEqual(input, output);

	output += ' world';
	t.is(input, 'hello');

	input += '123';
	t.is(output, 'hello world');

	t.end();
});
