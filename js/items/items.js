Core.ItemFactory = new Core.Factory(Core.Item);

Core.ItemFactory.define('potion', {
	name: 'potion',
	
	glyph: '!',
	colour: 'red',
	
	onConsume: function(entity) {
		entity.heal(10);
	},
	
	canConsume: function(entity) {
		return entity.hasComponent('Health') && entity.getHp() < entity.getMaxHp();
	},
	
	components: [
		Core.Components.Consumable
	]
});