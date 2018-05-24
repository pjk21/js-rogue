Core.ItemFactory = new Core.Factory(Core.Item);

Core.ItemFactory.define('potion', {
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

Core.ItemFactory.define('leatherHelmet', {
	name: 'leather helmet',
	
	glyph: '^',
	colour: 'brown',
	
	equipmentSlot: 'head',
	
	components: [
		Core.Components.Equipment
	]
});