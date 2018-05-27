Core.Map = function(properties) {
	properties = properties || {};
	
	this._width = properties.width || Core.getWidth();
	this._height = properties.height || Core.getHeight();
	
	this._tiles = [];
	this._explored = [];
	
	this._entities = {};
	this._items = {};
	
	this._generate(properties);
	
	var map = this;
	
	this._fov = new ROT.FOV.DiscreteShadowcasting(function(x, y) {
		return map.getTile(x, y).isTransparent();
	}, { topology: 4 });
};

Core.Map.prototype = {
	getWidth: function() {
		return this._width;
	},
	
	getHeight: function() {
		return this._height;
	},
	
	getFov: function() {
		return this._fov;
	},
	
	getCellIndex: function(x, y) {
		return x + (y * this.getWidth());
	},
	
	contains: function(x, y) {
		return x >= 0 && x < this.getWidth() && y >= 0 && y < this.getHeight();
	},
	
	getTile: function(x, y) {
		if (this.contains(x, y)) {
			var index = this.getCellIndex(x, y);			
			return this._tiles[index];
		}
		else {
			return Core.Tiles.nullTile;
		}
	},
	
	getNeighbours: function(x, y, include) {
		var neighbours = [];
		include = include || false;
		
		for (var ix = Math.max(x - 1, 0); ix < Math.min(x + 2, this.getWidth()); ix++)
		{
			for (var iy = Math.max(y - 1, 0); iy < Math.min(y + 2, this.getHeight()); iy++) {
				if (!include && ix === x && iy === y) {
					continue;
				}
				
				neighbours.push({ x: ix, y: iy });
			}
		}
		
		return neighbours;
	},
	
	anyNeighbours: function(x, y, predicate) {
		var neighbours = this.getNeighbours(x, y);
		
		for (var i = 0; i < neighbours.length; i++) {
			var neighbour = neighbours[i];
			
			if (predicate(neighbour.x, neighbour.y, this.getTile(neighbour.x, neighbour.y))) {
				return true;
			}
		}
		
		return false;
	},
	
	getRandomOpenCell: function() {
		var x, y;
		
		do {
			x = Math.floor(Math.random() * this.getWidth());
			y = Math.floor(Math.random() * this.getHeight());
		} while (!this.isOpenCell(x, y));
			
		return {
			x: x,
			y: y
		};
	},
	
	isOpenCell: function(x, y) {
		return this.getTile(x, y).isWalkable() && !this.getEntityAt(x, y);
	},
	
	setTile: function(x, y, tile) {
		var index = this.getCellIndex(x, y);
		this._tiles[index] = tile;
	},
	
	isExplored: function(x, y) {
		var index = this.getCellIndex(x, y);
		return this._explored[index];
	},
	
	setExplored: function(x, y, explored) {
		if (this.getTile(x, y) !== Core.Tiles.nullTile) {
			var index = this.getCellIndex(x, y);
			this._explored[index] = explored;
		}
	},
	
	addEntity: function(entity) {
		entity.setMap(this);
		
		var index = this.getCellIndex(entity.getX(), entity.getY());
		
		if (this._entities[index]) {
			throw new Error('There is already an entity at that position.');
		}
		
		this._entities[index] = entity;
		
		if (entity.hasComponent('Controller')) {
			Core.getGame().getScheduler().add(entity, true);
		}
	},
	
	removeEntity: function(entity) {
		var index = this.getCellIndex(entity.getX(), entity.getY());
		
		if (this._entities[index] === entity) {
			delete this._entities[index];
		}
		
		if (entity.hasComponent('Controller')) {
			Core.getGame().getScheduler().remove(entity);
		}
	},
	
	updateEntityPosition: function(entity, oldX, oldY) {
		if (typeof oldX === 'number' && typeof oldY === 'number') {
			var oldIndex = this.getCellIndex(oldX, oldY);
			
			if (this._entities[oldIndex] === entity) {
				delete this._entities[oldIndex];
			}
		}
		
		if (!this.contains(entity.getX(), entity.getY())) {
			throw new Error('Entity position is out of bounds.');
		}
		
		var index = this.getCellIndex(entity.getX(), entity.getY());
		
		if (this._entities[index]) {
			throw new Error('There is already an entity at that position.');
		}
		
		this._entities[index] = entity;
	},
	
	getEntityAt: function(x, y) {
		var index = this.getCellIndex(x, y);
		return this._entities[index];
	},
	
	addItem: function(item, x, y) {
		var index = this.getCellIndex(x, y);
		
		if (this._items[index]) {
			this._items[index].push(item);
		}
		else {
			this._items[index] = [ item ];
		}
		
		item.setPosition(x, y);
	},
	
	removeItem: function(item) {
		var index = this.getCellIndex(item.getX(), item.getY());
		
		if (this._items[index]) {
			for (var i = 0; i < this._items[index].length; i++) {
				if (this._items[index][i] === item) {
					this._items[index].splice(i, 1);
					
					if (this._items[index].length === 0) {
						delete this._items[index];
					}
					
					return;
				}
			}
		}
	},
	
	getItemsAt: function(x, y) {
		var index = this.getCellIndex(x, y);
		return this._items[index];		
	},
	
	_generate: function(properties) {
		var map = this;
		
		var generator = properties.generator;
		var generatorConfig = properties.generatorConfig || {};
		
		if (!generator.prototype.create) {
			this._generator = new ROT.Map.Arena(this._width, this._height);
			console.log('Error: Generator does not contain a create function.');
		}
		else {
			this._generator = new generator(this._width, this._height, generatorConfig);
		}
		
		var tiles = properties.tiles || [];
		
		var generatorCallback = function(x, y, value) {		
			if (tiles[value]) {
				map.setTile(x, y, tiles[value]);
			}
			else {
				map.setTile(x, y, Core.Tiles.nullTile);
			}
		};
		
		if (properties.onGenerate) {
			properties.onGenerate(this._generator, generatorCallback);
		}
		else {
			this._generator.create(generatorCallback);
		}
		
		if (properties.onPostGenerate) {
			properties.onPostGenerate(this, this._generator, generatorCallback);
		}	
		
		for (var x = 0; x < this.getWidth(); x++) {
			for (var y = 0; y < this.getHeight(); y++) {
				var index = this.getCellIndex(x, y);
				this._explored[index] = false;
			}
		}
	},
};