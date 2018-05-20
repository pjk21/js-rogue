Core.Game = function(options) {
	options = options || {};
	
	this._scheduler = new ROT.Scheduler.Speed();
	this._engine = new ROT.Engine(this._scheduler);
}

Core.Game.prototype = {
	getMap: function() {
		return this._map;
	},
	
	getPlayer: function() {
		return this._player;
	},
	
	getEngine: function() {
		return this._engine;
	},
	
	getScheduler: function() {
		return this._scheduler;
	},
	
	getEnded: function() {
		return this._ended;
	},
	
	init: function() {
		this._ended = false;
		
		Core.MessageLog.clear();
		Core.MessageLog.show();
		
		this._map = new Core.Map({
			width: Core.getWidth() * 2,
			height: Core.getHeight() * 2,
			
			generator: ROT.Map.Cellular,
			generatorConfig: { 
				connected: false
			},
			
			tiles: [ Core.Tiles.wallTile, Core.Tiles.floorTile ],
			
			onGenerate: function(generator, generatorCallback) {
				generator.randomize(0.5);
				
				for (var i = 0; i < 3; i++) {
					generator.create();
				}
				
				generator.create(generatorCallback);
				generator.connect(generatorCallback, 1);
			},
			
			onPostGenerate: function(map, generator, generatorCallback) {
				var noise = new ROT.Noise.Simplex();
				var wallCheck = function(x, y, tile) {
					return tile === Core.Tiles.grassTile;
				};
				
				for (var x = 0; x < map.getWidth(); x++) {
					for (var y = 0; y < map.getHeight(); y++) {
						var n = (noise.get(x / 30, y / 30) * 0.5 + 0.5);
						
						if (n < 0.23) {
							var tile = map.getTile(x, y);
							
							if (tile === Core.Tiles.floorTile) {
								map.setTile(x, y, Core.Tiles.grassTile);
							}
							else if (tile === Core.Tiles.wallTile) {
								if (map.anyNeighbours(x, y, wallCheck)) {								
									map.setTile(x, y, Core.Tiles.mossyWallTile);
								}
							}
						}
					}
				}					
			}
		});
		
		this._player = Core.EntityFactory.createPlayer();
		this._player.setPosition(this.getMap().getRandomOpenCell());		
		this.getMap().addEntity(this.getPlayer());
		
		for (var i = 0; i < 20; i++) {
			var goblin = Core.EntityFactory.createGoblin();
			goblin.setPosition(this.getMap().getRandomOpenCell());
			this.getMap().addEntity(goblin);
		}
	},
	
	end: function() {
		this._ended = true;
		
		this.getEngine().lock();
		Core.refresh();
	}
}