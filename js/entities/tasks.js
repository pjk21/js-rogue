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
};

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
};

Core.Tasks.killPlayer = {
	execute: function(entity) {
		var player = Core.getGame().getPlayer();
		var distance = Math.abs(player.getX() - entity.getX()) + Math.abs(player.getY() - entity.getY());
		
		if (distance === 1 && entity.hasComponent('Combat')) {
			entity.attack(player);
			return;
		}
		
		var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
			var blockingEntity = entity.getMap().getEntityAt(x, y);
			
			if (blockingEntity && blockingEntity !== player && blockingEntity !== entity) {
				return false;
			}
			
			return entity.getMap().getTile(x, y).isWalkable();
		}, { topology: 4 });
		
		var count = 0;
		path.compute(entity.getX(), entity.getY(), function(x, y) {
			if (count === 1) {
				entity.move(x - entity.getX(), y - entity.getY());
			}
			
			count++;
		});
	},
	
	getScore: function(entity) {
		if (entity.hasComponent('Sight') && entity.canSee(Core.getGame().getPlayer())) {
			return 10;
		}
		
		return -1;
	}
}