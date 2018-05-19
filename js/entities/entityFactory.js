Core.EntityFactory = {
	_templates: {},
	
	define: function(name, template, options) {
		this._templates[name] = template;
	},
	
	create: function(name) {
		if (!this._templates[name]) {
			throw new Error(String.format('No such template: %s.', name));
		}
		
		var template = Object.create(this._templates[name]);
		return new Core.Entity(template);
	},
	
	createPlayer: function() {
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
		})
	},
	
	createGoblin: function() {
		return new Core.Entity({
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
		})
	}
};