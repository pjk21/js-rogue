Core.UI = {
	init: function() {
		this._hpBar = {
			valueElement: document.getElementById('healthBarValue'),
			valueTextElement: document.getElementById('healthBarText'),
			
			update: function(hp, maxHp) {
				var healthPercent = (hp / maxHp) * 100;
				
				this.valueElement.setAttribute('style', 'width: %s%;'.format(healthPercent));
				this.valueTextElement.innerHTML = '%s / %s'.format(hp, maxHp);
			}
		};
		
		this._effectList = {
			listElement: document.getElementById('effectList'),
			
			update: function(entity) {
				this.listElement.innerHTML = '';
				
				for (var effectName in entity.effects) {
					var effect = entity.effects[effectName];					
					
					var element = document.createElement('li');
					element.innerHTML = '%s (%s)'.format(effect.name, effect.duration);
					
					this.listElement.append(element);
				}
			}
		}
	},
	
	update: function() {
		var player = Core.getGame().getPlayer();
		
		this._hpBar.update(player.getHp(), player.getMaxHp());
		this._effectList.update(player);
	}
};