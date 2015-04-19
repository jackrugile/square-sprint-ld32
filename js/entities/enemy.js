$.enemy = function( opt ) {};

$.enemy.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.tick = 0;
	this.dead = false;
	this.yBase = this.y;
	this.vy = 0;
	this.deathTick = 0;
	this.deathTickMax = 5;
};

$.enemy.prototype.step = function() {
	if( this.dead ) {
		//this.vy += 1;
		//this.y += this.vy;
	} else {
		this.tick++;
	}

	if( this.deathTick > 0 ) {
		this.deathTick--;
	}

	if( !this.dead && this.checkCollision() ) {
		this.dead = true;
		this.deathTick = this.deathTickMax;
		//this.vy = 3;
		var sound = $.game.playSound( 'explode1' );
		$.game.sound.setPlaybackRate( sound, 0.9 + $.rand( -0.1, 0.1 ) );
	}

	/*if( this.x + this.w < 0 || ( this.dead && this.y > $.game.height ) ) {
		$.game.state.enemies.release( this );
	}*/

	if( this.dead && this.deathTick<= 0 ) {
		$.game.state.enemies.release( this );
	}
};

$.enemy.prototype.render = function() {
	var scale = 0.95 + Math.sin( $.game.lifetime * 4 ) * 0.05;
	$.ctx.save();
	$.ctx.translate( this.x + this.w / 2 , this.y + this.h / 2 );
	$.ctx.scale( scale, scale );
	$.ctx.fillStyle( 'hsla(' + ( $.game.state.level.hue ) + ', 30%, 15%, 1)' );
	$.ctx.fillRect( -this.w / 2, -this.h / 2, this.w, this.h );
	$.ctx.restore();

	var scale = 0.75 + Math.cos( $.game.lifetime * 4 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( this.x + this.w / 2 , this.y + this.h / 2 );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( $.game.lifetime * 2 );
	$.ctx.fillStyle( 'hsla(' + ( $.game.state.level.hue ) + ', 70%, 60%, 1)' );
	$.ctx.fillRect(	-4, -4, 8, 8 );
	$.ctx.restore();

	if( this.deathTick ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, 1)' );
		$.ctx.fillRect( this.x, this.y, this.w, this.h );
	}
};

$.enemy.prototype.checkCollision = function() {
	var tl = { x: this.x, y: this.y },
		tr = { x: this.x + this.w, y: this.y },
		bl = { x: this.x, y: this.y + this.h },
		br = { x: this.x + this.w, y: this.y + this.h },
		h1 = { x: $.game.state.hero.x, y: $.game.state.hero.y },
		h2 = { x: $.game.state.hero.ox, y: $.game.state.hero.oy };

	// slight compensation to make killing easier
	var aabb = $.collide(
		this,
		{
			x: $.game.state.hero.x - $.game.state.hero.diag,
			y: $.game.state.hero.y - $.game.state.hero.diag,
			w: $.game.state.hero.diag * 2,
			h: $.game.state.hero.diag * 2
		}
	);

	if( aabb ) {
		// check aabb
		return true;
	} else if( $.game.state.hero.chargingTail && $.segmentIntersect( tl, tr, h1, h2 ) ) {
		// check top left - top right
		return true;
	} else if( $.game.state.hero.chargingTail && $.segmentIntersect( tr, br, h1, h2 ) ) {
		// check top right - bottom right
		return true;
	} else if( $.game.state.hero.chargingTail && $.segmentIntersect( br, bl, h1, h2 ) ) {
		// check bottom right- bottom left
		return true;
	} else if( $.game.state.hero.chargingTail && $.segmentIntersect( bl, tl, h1, h2 ) ) {
		// check bottom left - top left
		return true;
	} else {
		return false;
	}
};