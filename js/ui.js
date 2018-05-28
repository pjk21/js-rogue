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
		
		this._xpBar = {
			valueElement: document.getElementById('xpBarValue'),
			valueTextElement: document.getElementById('xpBarText'),
			
			update: function(xp, xpForNextLevel) {
				var xpPercent = (xp / xpForNextLevel) * 100;
				
				this.valueElement.setAttribute('style', 'width: %s%;'.format(xpPercent));
				this.valueTextElement.innerHTML = '%s%'.format(xpPercent.toFixed(1));
			}
		};
		
		this._effectList = {
			listElement: document.getElementById('effectList'),
			
			update: function(entity) {
				this.listElement.innerHTML = '';
				
				for (var effectName in entity.effects) {
					var effect = entity.effects[effectName];					
					
					var element = document.createElement('li');
					element.innerHTML = '%s (%s)'.format(effect.name, effect.duration ? effect.duration : '&#x221e;');
					
					this.listElement.append(element);
				}
			}
		}
	},
	
	show: function() {
		document.getElementById('messageLog').setAttribute('class', '');
		document.getElementById('statsPanel').setAttribute('class', '');
	},
	
	hide: function() {
		document.getElementById('messageLog').setAttribute('class', 'collapsed');
		document.getElementById('statsPanel').setAttribute('class', 'collapsed');
	},
	
	update: function() {
		var player = Core.getGame().getPlayer();
		
		this._hpBar.update(player.getHp(), player.getMaxHp());
		this._xpBar.update(player.getXp(), player.getXpForNextLevel());
		this._effectList.update(player);
	}
};