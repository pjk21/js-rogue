Core.Item = function(properties) {
	properties = properties || {};
	
	Core.GameObject.call(this, properties);
};

Core.Item.extend(Core.GameObject);

Object.assign(Core.Item.prototype, {

});