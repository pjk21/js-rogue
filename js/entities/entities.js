Core.EntityFactory = new Core.Factory(Core.Entity);

Core.EntityFactory.define('goblin', {
	name: 'goblin',
	
	glyph: 'g',
	colour: 'green',
	
	speed: 50,
	strength: 4,
	toughness: 0,
	sightRadius: 3,
	
	tasks: [
		Core.Tasks.rest,
		Core.Tasks.wander
	],
	
	components: [
		Core.Components.AiController,
		Core.Components.Health,
		Core.Components.Combat,
		Core.Components.Sight
	]
});

Core.EntityFactory.createPlayer = function() {
	return new Core.Entity({
		name: 'Player',
		
		glyph: '@',
		
		strength: 5,
		toughness: 1,
		sightRadius: 6,
		
		components: [
			Core.Components.PlayerController,
			Core.Components.Health,
			Core.Components.Combat,
			Core.Components.Sight
		]
	});
};