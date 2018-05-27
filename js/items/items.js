Core.ItemFactory = new Core.Factory(Core.Item);

Core.ItemFactory.define('potion', 100, {
	name: 'potion',
	
	glyph: '!',
	colour: 'red',
	
	onConsume: function(entity) {
		entity.heal(10);
		
		Core.MessageLog.add('You heal for 10 hit points!', 'success');
		return true;
	},
	
	canConsume: function(entity) {
		if (entity.hasComponent('Health')) {
			if (entity.getHp() < entity.getMaxHp()) {
				return true;
			}
			else {
				Core.MessageLog.add('You are already at full health!', 'warning');
				return false;
			}
		}
		
		return false;
	},
	
	components: [
		Core.Components.Consumable
	]
});

Core.ItemFactory.define('antidote', 25, {
	name: 'antidote',
	
	glyph: '!',
	colour: 'blue',
	
	onConsume: function(entity) {
		if (entity.effects.poison) {
			entity.removeEffect('poison');
			
			Core.MessageLog.add('You cure yourself of poison!', 'info');
			return true;
		}
	},
	
	canConsume: function(entity) {
		if (!entity.effects.poison) {
			Core.MessageLog.add('You are not poisoned!', 'warning');
			return false;
		}
		
		return true;
	},
	
	components: [
		Core.Components.Consumable
	]
});

Core.ItemFactory.define('leatherHelmet', 8, {
	name: 'leather helmet',
	
	glyph: '^',
	colour: 'brown',
	
	equipmentSlot: 'head',
	
	components: [
		Core.Components.Equipment
	]
});

Core.ItemFactory.define('ironHelmet', 5, {
	name: 'iron helmet',
	
	glyph: '^',
	colour: 'silver',
	
	equipmentSlot: 'head',
	
	components: [
		Core.Components.Equipment
	]
});

Core.ItemFactory.define('ironSword', 5, {
	name: 'iron sword',
	
	glyph: '/',
	colour: 'silver',
	
	equipmentSlot: 'mainHand',
	
	attackValue: 10,
	
	components: [
		Core.Components.Equipment
	]
});