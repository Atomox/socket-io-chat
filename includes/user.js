

var users_module = (function userFactory() {

	var client_list = {},
			user_id_counter = 0;


	/**
	 * Add a user for this client.
	 *
	 * @param {string} client_id
	 *   The unique ID of the client.
	 * @param {mixed} data
	 *   Any data passed on the init.
	 *
	 * @return {object|boolean}
	 *   Either the created user object, or false on failure.
	 *
	 * @throws {Error}
	 *   If [this condition is met]If they already exist, we'll throw an error.
	 */
	function add_user(client_id, data) {
		if (typeof client_id === 'undefined' || client_id === null) {
			throw new Error('Cannot have client without ID.');
		}
		else if (typeof client_list[client_id] !== 'undefined') {
			throw new Error('Client already exists.');
		}

		client_list[client_id] = {
			client_id: client_id,
			uid: user_id_counter,
			name: gen_name(client_id),
		};

		user_id_counter++;

		return client_list[client_id];
	}


	function get_user_by_name(name) {
		return get_user_by_trait(null, null, name);
	}


	function get_user_by_client_id(client_id) {
		return get_user_by_trait(client_id);
	}


	function get_user_by_uid(uid) {
		get_user_by_trait(null, uid);
	}


	/**
	 * Get only a users public data.
	 *
	 * @param  {string} client_id
	 *   The client ID of the user.
	 *
	 * @return {object|boolean}
	 *   The user object's public data, or false on failure.
	 */
	function get_public_user(client_id) {
		if (user = get_user_by_client_id(client_id)) {
			return {
    		uid: user.uid,
    		name: user.name
    	};
		}
		return false;
	}


	/**
	 * Get a user by one of their traits.
	 *
	 * @return {object|false}
	 *   User object if found. Otherwise, false.
	 */
	function get_user_by_trait(client_id, uid, name) {
		var trait = null,
			trait_val = null;

		if (isset(client_id)) {		trait = 'client_id'; 	trait_val = client_id;	}
		else if(isset(uid)) 		{		trait = 'uid'; 				trait_val = uid; 				}
		else if (isset(name)) { 	trait = 'name'; 			trait_val = name;				}

		if (isset(trait)) {
			for (i in client_list) {
				if (client_list[i][trait] == trait_val) {
					return client_list[i];
				}
			}
		}
		return false;
	}


	/**
	 * Generate a random name not already taken by another user.
	 */
	function gen_name(id) {

		/**
		 * These are all names of Ubuntu releases.
		 */
		var names = [
			'Yakkety Yak',
			'Xenial Xerus',
			'Trusty Tahr',
			'Precise Pangolin',
			'Wily Werewolf',
			'Vivid Vervet',
			'Utopic Unicorn',
			'Saucy Salamander',
			'Raring Ringtail',
			'Quantal Quetzal',
			'Oneiric Ocelot',
			'Natty Narwhal',
			'Maverick Meerkat',
			'Lucid Lynx',
			'Karmic Koala',
			'Jaunty Jackalope',
			'Intrepid Ibex',
			'Hardy Heron',
			'Gutsy Gibbon',
			'Feisty Fawn',
			'Edgy Eft',
			'Dapper Drake',
			'Breezy Badger',
			'Hoary Hedgehog',
			'Warty Warthog'
		],
			result = null;

		while(result === null) {
			var i = getRand(0, names.length-1);
			if (get_user_by_name(names[i]) === false) {
				result = names[i];
				break;
			}
		}

		return result;
	}


	/**
	 * Generate a random number between min - max.
	 */
	function getRand(max, min) { return Math.floor((Math.random()) * (max - min)) + min; }


	/**
	 * Checks if value is set.
	 */
	function isset(val) {
		return (typeof val !== 'undefined' && val !== null) ? true : false;
	}


	return {
		add_user: add_user,
		get_user: get_user_by_client_id,
		get_public_user, get_public_user,
		get_user_by_name: get_user_by_name,
		get_user_by_uid: get_user_by_uid
	};

})();

module.exports = {
	add: users_module.add_user,
	get: users_module.get_user,
	getById: users_module.get_user_by_uid,
	getByName: users_module.get_user_by_name,
	getPublicUser: users_module.get_public_user
};