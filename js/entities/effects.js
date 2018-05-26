Core.EffectFactory = new Core.Factory(Core.Effect);

Core.EffectFactory.define('poison', {
	name: 'poison',
	duration: { min: 3, max: 8 },
	
	onTurnEnd: function(entity) {
		if (entity.hasComponent('Health')) {
			var minimumDamage = Math.ceil(entity.getMaxHp() * 0.05);
			var maximumDamage = Math.ceil(entity.getMaxHp() * 0.25);

			var damage = Core.getRandomNumber(minimumDamage, maximumDamage);
			damage = Math.min(damage, entity.getHp() - 1);
			
			if (damage > 0) {
				entity.damage(this, damage);
			}
		}
	}
});