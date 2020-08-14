const assert = require('assert');

module.exports = function (input, copy) {
	// assert.deepStrictEqual(copy, input, 'initial copy');

	// RegExp
	copy.regexp.lastIndex = 9;
	assert.notEqual(input.regexp.lastIndex, 9, 'regexp.lastindex');

	// Array + Date
	input.array[0].setMinutes(1);
	assert.notEqual(copy.array[0].getMinutes(), 0, 'Array<Date> #1');

	copy.array[3] = new Date(copy.array[3]);
	assert.notEqual(input.array[3] instanceof Date, true, 'Array<Date> #2');

	// Set
	input.set.add(9);
	assert.equal(copy.set.has(9), false, 'Set #1');

	[...copy.set][2].push(123);
	assert.deepEqual([...input.set][2], [1, 2, 3], 'Set #2');
	assert.deepEqual([...copy.set][2], [1, 2, 3, 123], 'Set #3');

	// Map
	input.map.set('hello', 'world');
	assert.equal(copy.map.has('hello'), false, 'Map #1');

	[...copy.map.keys()][0].bar = 123;
	assert.deepEqual([...input.map.keys()][0], { foo: 1 }, 'Map #2');
	assert.deepEqual([...copy.map.keys()][0], { foo: 1, bar: 123 }, 'Map #3');

	// Int8Array
	copy.int8arr[1] = 42;
	assert.equal(input.int8arr[1], 5, 'Int8 #1');

	input.int8arr[0] = 0;
	assert.equal(copy.int8arr[0], 4, 'Int8 #2');

	// Buffer :: "hello"
	copy.buffer.write('foobar');
	assert.equal(input.buffer.toString(), 'hello', 'Buffer #1');

	copy.buffer[1] = 11;
	assert.notEqual(input.buffer[1], copy.buffer[1], 'Buffer #2');

	const current = copy.buffer.toString();
	input.buffer.write('hello');
	assert.equal(copy.buffer.toString(), current, 'Buffer #3');

	// Symbol
	assert.equal(input.symbol1, copy.symbol1, 'Symbol #1');
	assert.equal(input.symbol2, copy.symbol2, 'Symbol #2');

	// Symbol Properties
	assert.equal(input[input.symbol1], 'hello', 'SymProp #1');
	assert.equal(copy[copy.symbol1], 'hello', 'SymProp #2');

	input[input.symbol2].push(7, 8, 9);
	assert.equal(input[input.symbol2].length, 7, 'SymProp #3');
	assert.equal(copy[copy.symbol2].length, 4, 'SymProp #4');

	copy[copy.symbol2].push('hello');
	assert.equal(input[input.symbol2].length, 7, 'SymProp #3');
	assert.equal(copy[copy.symbol2].length, 5, 'SymProp #4');

	// NON-Enumerable Properties
	assert.deepEqual(
		Object.getOwnPropertyDescriptor(input, 'hidden1'),
		Object.getOwnPropertyDescriptor(copy, 'hidden1'),
		'Hidden #1'
	);

	assert.deepEqual(
		Object.getOwnPropertyDescriptor(input, 'hidden2'),
		Object.getOwnPropertyDescriptor(copy, 'hidden2'),
		'Hidden #2'
	);

	assert.equal(input.secret, copy.secret, 'Hidden #3');

	copy.hidden2.push('hello');
	assert.equal(input.hidden2.includes('hello'), false, 'Hidden #4');
}
