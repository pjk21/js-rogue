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
		this._speed = properties.speed || 100;
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
};

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
		this._speed = properties.speed || 100;
		this._tasks = properties.tasks || [ Core.Tasks.rest ];
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
		
		this.endTurn();
	}
};

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
		this._maxHp = properties.maxHp || 10;
		this._hp = properties.hp || this._maxHp;
		
		this._restingHealRate = properties.restingHealRate || 0;
	},
	
	damage: function(attacker, damage) {
		this._hp -= damage;
		this.raiseEvent('onDamage', attacker, damage);
		Core.MessageLog.add(String.format('%s hits %s for %s HP.', attacker.getName(), this.getName(), damage), 'combat');
		
		if (this._hp <= 0) {
			this.raiseEvent('onDeath', attacker);
			attacker.raiseEvent('onKill', this);
			
			Core.MessageLog.add(String.format('%s has died.', this.getName()), 'combat');
		}
	},
	
	heal: function(amount) {
		this._hp = Math.min(this._hp + amount, this._maxHp);
	}
};

Core.Components.Combat = {
	name: 'Combat',
	
	getStrength: function() {
		return this._strength;
	},
	
	getToughness: function() {
		return this._toughness;
	},
	
	init: function(properties) {
		this._strength = properties.strength || 1;
		this._toughness = properties.toughness || 1;
	},
	
	attack: function(target) {
		if (target.hasComponent(Core.Components.Combat)) {
			var attack = this.getStrength();		
			var defense = target.getToughness();
			
			if (this.hasComponent('Body')) {
				attack += this.getEquipmentAttack();
				defense += this.getEquipmentDefense();
			}
			
			var damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
			
			target.damage(this, damage);
		}
	}
};

Core.Components.Sight = {
	name: 'Sight',
	group: 'Sight',
	
	getSightRadius: function() {
		return this._sightRadius;
	},
	
	init: function(properties) {
		this._sightRadius = properties.sightRadius || 5;
	}
};

Core.Components.Inventory = {
	name: 'Inventory',
	group: 'Inventory',
	
	getItems: function() {
		return this._items;
	},
	
	init: function(properties) {
		this._items = [];
	},
	
	addItem: function(item) {
		this._items.push(item);
	},
	
	removeItem: function(item) {
		var index = this._items.indexOf(item);
		
		if (item) {
			this._items.splice(index, 1);
		}
		
		return true;
	},
	
	takeItem: function() {
		var items = this.getMap().getItemsAt(this.getX(), this.getY());
		
		if (items) {
			var item = items[items.length - 1];
			this.addItem(item);
			
			this.getMap().removeItem(item);
			Core.MessageLog.add('You take the %s.'.format(item.getName()), 'info');
			
			return true;
		}

		Core.MessageLog.add('There are no items to pickup!', 'warning');
		return false;
	},
	
	dropItem: function(item) {
		var index = this._items.indexOf(item);
		
		if (index >= 0) {
			if (this.getMap()) {
				this.getMap().addItem(item, this.getX(), this.getY());
			}
			
			this._items.splice(index, 1);
			
			Core.MessageLog.add('You drop the %s.'.format(item.getName()), 'info');
			return true;
		}
		
		return false;
	}
};

Core.Components.BodyPart = function(properties) {
	properties = properties || {};

	this._name = properties.name || '';
	this._equipped = properties.equipped || null;
},

Core.Components.BodyPart.prototype = {
	getName: function() {
		return this._name;
	},
	
	getEquipped: function() {
		return this._equipped;
	},
	
	setEquipped: function(item) {
		this._equipped = item;
	}
};

Core.Components.Body = {
	name: 'Body',
	
	getBodyPart: function(name) {
		return this._body[name];
	},
	
	getBody: function() {
		return this._body;
	},
	
	getEquipmentAttack: function() {
		var result = 0;
		
		for (var key in this.getBody()) {
			var bodyPart = this.getBodyPart(key);
			
			if (bodyPart.getEquipped()) {
				result += bodyPart.getEquipped().getAttackValue();
			}
		}
		
		return result;
	},
	
	getEquipmentDefense: function() {
		var result = 0;
		
		for (var key in this.getBody()) {
			var bodyPart = this.getBodyPart(key);
			
			if (bodyPart.getEquipped()) {
				result += bodyPart.getEquipped().getDefenseValue();
			}
		}
		
		return result;
	},
	
	init: function(properties) {
		this._body = {};
		
		if (properties.body) {
			for (var key in properties.body) {
				var part = properties.body[key];
				
				var equipment = part.getEquipped();
				
				if (equipment) {
					if(typeof equipment === 'string') {
						var item = Core.ItemFactory.create(equipment);
						
						if (item.getEquipmentSlot() === part.getName()) {
							part.setEquipped(item);
						}
						else {
							part.setEquipped(null);
						}
					}
				}
				
				this._body[part.getName()] = part;
			}
		}
	},
	
	equip: function(item) {
		if (item.hasComponent('Equipment')) {
			var bodyPart = this.getBodyPart(item.getEquipmentSlot());
			
			if (bodyPart) {
				if (bodyPart.getEquipped()) {
					this.unequip(bodyPart);
				}
				
				bodyPart.setEquipped(item);
				this.removeItem(item);
				
				Core.MessageLog.add('You equip the %s.'.format(item.getName()), 'info');
				return true;
			}
		}
		
		Core.MessageLog.add('You cannot equip the %s.'.format(item.getName()), 'warning');
		return false;
	},
	
	unequip: function(bodyPart) {
		if (typeof bodyPart === 'string') {
			bodyPart = this.getBodyPart(bodyPart);
		}
		
		if (bodyPart && bodyPart.getEquipped()) {
			var item = bodyPart.getEquipped();
			
			bodyPart.setEquipped(null);
			this.addItem(item);			
			
			Core.MessageLog.add('You unequip the %s.'.format(item.getName()), 'info');
			return true;
		}
		
		return false;
	}
};