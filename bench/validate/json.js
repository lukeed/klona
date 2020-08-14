const assert = require('uvu/assert');

module.exports = function (input, output) {
	assert.equal(output, input, 'initial copy');

	output[0].age++;
	assert.is.not(input[0].age, 34, 'increment');

	output[1].details.address.coords.longitude = 100;
	assert.is.not(input[1].details.address.coords.longitude, 100, 'nested assignment');

	output[0].friends[1].friends_common.friends_of_friends.push('BOB');
	assert.is(input[0].friends[1].friends_common.friends_of_friends.includes('BOB'), false, 'nested push');
}
