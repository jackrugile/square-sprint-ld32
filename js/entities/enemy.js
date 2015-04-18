$.enemy = function( opt ) {};

$.enemy.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.tick = 0;
};

$.enemy.prototype.step = function() {
	this.x -= 3;
	this.y = 300 + Math.sin( this.tick * 0.05 ) * 50;
	this.tick++;

	if( $.game.state.hero.charging && this.checkCollision() ) {
		$.game.state.enemies.release( this );
	}
};

$.enemy.prototype.render = function() {
	/*$.ctx.lineWidth( 2);
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillRect( this.x, this.y, this.w, this.h );*/

	$.ctx.save();
	$.ctx.lineWidth( 2);
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillRect( this.x, this.y, this.w, this.h );
	$.ctx.restore();
};

$.enemy.prototype.checkCollision = function() {
	var tl = { x: this.x, y: this.y },
		tr = { x: this.x + this.w, y: this.y },
		bl = { x: this.x, y: this.y + this.h },
		br = { x: this.x + this.w, y: this.y + this.h },
		h1 = { x: $.game.state.hero.x, y: $.game.state.hero.y },
		h2 = { x: $.game.state.hero.ox, y: $.game.state.hero.oy };

	if( $.segmentIntersect( tl, tr, h1, h2 ) ) {
		// check top left - top right
		return true;
	} else if( $.segmentIntersect( tr, br, h1, h2 ) ) {
		// check top right - bottom right
		return true;
	} else if( $.segmentIntersect( br, bl, h1, h2 ) ) {
		// check bottom right- bottom left
		return true;
	} else if( $.segmentIntersect( bl, tl, h1, h2 ) ) {
		// check bottom left - top left
		return true;
	} else {
		return false;
	}
};