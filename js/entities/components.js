Core.Components.PlayerController = {
	name: 'PlayerController',
	group: 'Controller',
	
	getSpeed: function() {
		return this._speed;
	},
	
	listeners: {
		onDeath: function(attacker) {
			Core.getGame().end();
		}
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
	}
}

Core.Components.AiController = {
	name: 'AiController',
	group: 'Controller',
	
	getSpeed: function() {
		return this._speed;
	},
	
	listeners: {
		onDeath: function(attacker) {
			this.getMap().removeEntity(this);
		}
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
	
	damage: function(attacker, damage) {
		this._hp -= damage;
		this.raiseEvent('onDamage', attacker, damage);
		console.log(this.getName() + ' is hit by ' + attacker.getName() + '  for ' + damage + ' damage! ' + this._hp + '/' + this._maxHp);
		
		if (this._hp <= 0) {
			this.raiseEvent('onDeath', attacker);
			attacker.raiseEvent('onKill', this);
		}
	},
	
	heal: function(amount) {
		this._hp = Math.min(this._hp + amount, this._maxHp);
	}
}

Core.Components.Combat = {
	name: 'Combat',
	
	getStrength: function() {
		return this._strength;
	},
	
	getToughness: function() {
		return this._toughness;
	},
	
	init: function(properties) {
		this._strength = properties['strength'] || 1;
		this._toughness = properties['toughness'] || 1;
	},
	
	attack: function(target) {
		if (target.hasComponent(Core.Components.Combat)) {
			var attack = this.getStrength();
			var defense = target.getToughness();
			var damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
			
			target.damage(this, damage);
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