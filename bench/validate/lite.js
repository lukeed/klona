const assert = require('uvu/assert');

module.exports = function (input, copy) {
	assert.equal(copy, input, 'initial copy');

	copy[0].age++;
	assert.is.not(input[0].age, 34, 'increment');

	copy[1].details.address.coords.longitude = 100;
	assert.is.not(input[1].details.address.coords.longitude, 100, 'nested assignment');

	copy[0].friends[1].friends_common.friends_of_friends.push('BOB');
	assert.is(input[0].friends[1].friends_common.friends_of_friends.includes('BOB'), false, 'nested push');

	input[0].joined.setHours(9);
	assert.not.equal(input[0].joined, copy[0].joined);

	copy[0].joined.setMinutes(56);
	assert.not.equal(input[0].joined, copy[0].joined);

	copy[1].locales.lastIndex = 9;
	assert.is.not(input[1].locales.lastIndex, copy[1].locales.lastIndex);
}
