Core.EntityFactory = new Core.Factory(Core.Entity);

Core.EntityFactory.createPlayer = function() {
	return new Core.Entity({
		name: 'Player',
		
		glyph: '@',
		
		strength: 5,
		toughness: 1,
		sightRadius: 6,
		restingHealRate: 2,
		
		body: {
			head: new Core.Components.BodyPart({ name: 'head', equipped: 'leatherHelmet' }),
			torso: new Core.Components.BodyPart({ name: 'torso' }),
			mainHand: new Core.Components.BodyPart({ name: 'mainHand', equipped: 'ironSword' }),
			offHand: new Core.Components.BodyPart({ name: 'offHand' }),
			legs: new Core.Components.BodyPart({ name: 'legs' }),
			feet: new Core.Components.BodyPart({ name: 'feet' })
		},
		
		components: [
			Core.Components.PlayerController,
			Core.Components.Health,
			Core.Components.Combat,
			Core.Components.ExperienceGainer,
			Core.Components.Sight,
			Core.Components.Inventory,
			Core.Components.Body
		]
	});
};

Core.EntityFactory.define('goblin', 100, {
	name: 'goblin',
	
	glyph: 'g',
	colour: 'green',
	
	speed: 50,
	strength: 4,
	toughness: 0,
	sightRadius: 3,
	xp: 5,
	
	tasks: [
		Core.Tasks.rest,
		Core.Tasks.wander,
		Core.Tasks.killPlayer
	],
	
	components: [
		Core.Components.AiController,
		Core.Components.Health,
		Core.Components.Combat,
		Core.Components.ExperienceGiver,
		Core.Components.Sight
	]
});