class Users {
	constructor() {
		this.client_list = {},
			this.user_id_counter = 0;
	}

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
	 *   If they already exist, we'll throw an error.
	 */
	add(client_id, data) {
		if (typeof client_id === 'undefined' || client_id === null) {
			throw new Error('Cannot have client without ID.');
		}
		else if (typeof this.client_list[client_id] !== 'undefined') {
			console.log(this.client_list[client_id]);
			throw new Error('Client already exists. "' + client_id + '"');
		}

		this.client_list[client_id] = {
			client_id: client_id,
			uid: this.user_id_counter,
			name: this.genName(client_id),
		};

		this.user_id_counter++;

		return this.client_list[client_id];
	}

	/**
	 * Remove the user from the user list.
	 *
	 * @param {string} client_id
	 *   The unique ID of the client.
	 *
	 * @return {object|boolean}
	 *   Either the removed user object, or false on failure.
	 *
	 * @throws {Error}
	 *   Errors if users does not exist.
	 */
	remove(client_id) {
		var user = this.getUserByClientId(client_id);
		if (user) {
			var pos = this.getUserByTrait(client_id,null,null,true);
			if (pos) {
				delete this.client_list[pos];
				return user;
			}
		}
		else {
			throw new Error('Cannot remove user whom does not exist.');
		}

		return false;
	}

	get(client_id) {
		return this.getUserByClientId(client_id);
	}

	getUserByName(name) {
		return this.getUserByTrait(null, null, name);
	}


	getUserByClientId(client_id) {
		return this.getUserByTrait(client_id);
	}


	getUserByUid(uid) {
		return this.getUserByTrait(null, uid);
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
	getPublicUser(client_id) {
		if (user = this.getUserByClientId(client_id)) {
			return this.formatUserPublic(user);
		}
		return false;
	}


	formatUserPublic(user) {
		return {
  		uid: user.uid,
  		name: user.name
  	};
	}


	/**
	 * Get a user by one of their traits.
	 *
	 * @return {object|false}
	 *   User object if found. Otherwise, false.
	 */
	getUserByTrait(client_id, uid, name, get_index) {
		var trait = null,
			trait_val = null;

		if (this.isset(client_id)) 	{		trait = 'client_id'; 	trait_val = client_id;	}
		else if(this.isset(uid)) 		{		trait = 'uid'; 				trait_val = uid; 				}
		else if (this.isset(name)) 	{ 	trait = 'name'; 			trait_val = name;				}

		if (this.isset(trait)) {
			for (i in this.client_list) {
				if (this.client_list[i][trait] == trait_val) {
					if (get_index === true) {
						return i;
					}
					else {
						return this.client_list[i];
					}
				}
			}
		}
		return false;
	}


	/**
	 * Get a public list of user data in this group.
	 */
	getAllPublic() {
		var results = [];
		for (i in this.client_list) {
			results.push(this.formatUserPublic(this.client_list[i]));
		}

		return results;
	}


	/**
	 * Generate a random name not already taken by another user.
	 */
	genName(id) {

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
			var i = this.getRand(0, names.length-1);
			if (this.getUserByName(names[i]) === false) {
				result = names[i];
				break;
			}
		}

		return result;
	}


	/**
	 * Generate a random number between min - max.
	 */
	getRand(max, min) { return Math.floor((Math.random()) * (max - min)) + min; }


	/**
	 * Checks if value is set.
	 */
	isset(val) {
		return (typeof val !== 'undefined' && val !== null) ? true : false;
	}
}

module.exports = {
	Users: Users
};