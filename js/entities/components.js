Core.Components.PlayerController = {
	name: 'PlayerController',
	group: 'Controller',
	
	getSpeed: function() {
		return this._speed;
	},
	
	init: function(properties) {
		this._speed = properties['speed'] || 100;
	},
	
	act: function() {
		if (this._acting) {
			return;
		}
		
		this._acting = true;
		Core.refresh();		
		
		Core.getGame().getEngine().lock();
		this._acting = false;
	},
	
	listeners: {
		onDeath: function(attacker) {
			Core.getGame().end();
		}
	}
}

Core.Components.AiController = {
	name: 'AiController',
	group: 'Controller',
	
	getSpeed: function() {
		return this._speed;
	},
	
	init: function(properties) {
		this._speed = properties['speed'] || 100;
		this._tasks = properties['tasks'] || [ Core.Tasks.rest ];
	},
	
	act: function() {
		var selectedTask = { 
			task: null,
			score: -1
		};
		
		for (var i = 0; i < this._tasks.length; i++) {
			var task = this._tasks[i];
			
			var score = task.getScore ? task.getScore(this) : 0;
			
			if (score >= 0) {
				if (score > selectedTask.score) {
					selectedTask.task = task.execute;
					selectedTask.score = score;
				}
				else if (score === selectedTask.score) {
					var coin = Math.floor(Math.random() * 2) % 2 === 0;
					
					if (coin) {
						selectedTask.task = task.execute;
						selectedTask.score = score;
					}
				}
			}
		}

		if (selectedTask.task) {
			selectedTask.task(this);
		}
	}
}

Core.Components.Health = {
	name: 'Health',
	
	getMaxHp: function() {
		return this._maxHp;
	},
	
	getHp: function() {
		return this._hp;
	},
	
	getRestingHealRate: function() {
		return this._restingHealRate;
	},
	
	init: function(properties) {
		this._maxHp = properties['maxHp'] || 10;
		this._hp = properties['hp'] || this._maxHp;
		
		this._restingHealRate = properties['restingHealRate'] || 0;
	},
	
	listeners: {
		onDamage: function(attacker, damage) {
			this._hp -= damage;
			
			if (this._hp <= 0) {
				this.raiseEvent('onDeath', attacker);
				attacker.raiseEvent('onKill', this);
			}
		}
	}
}

Core.Components.Sight = {
	name: 'Sight',
	group: 'Sight',
	
	getSightRadius: function() {
		return this._sightRadius;
	},
	
	init: function(properties) {
		this._sightRadius = properties['sightRadius'] || 5;
	}
}