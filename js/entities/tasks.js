Core.Tasks = {};

Core.Tasks.rest = {
	execute: function(entity) {
		if (entity.hasComponent('Health')) {
			entity.heal(entity.getRestingHealRate());
		}
	},
	
	getScore: function(entity) {
		return 0;
	}
}

Core.Tasks.wander = {
	execute: function(entity) {
		var movement = Math.floor(Math.random() * 2) % 2 === 0 ? -1 : 1;
		
		if (Math.floor(Math.random() * 2) % 2 === 0) {
			entity.move(movement, 0);
		}
		else {
			entity.move(0, movement);
		}
	},
	
	getScore: function(entity) {
		return 0;
	}
}