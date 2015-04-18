$.statePlay = {};

$.statePlay.create = function() {
	this.tick = 0;
	this.hero = new $.hero();
};

$.statePlay.step = function( dt ) {
	this.hero.step();
	this.tick++;
};

$.statePlay.render = function( dt ) {
	$.ctx.clear( 'hsla(' + this.hero.hue + ', 10%, 10%, 1)' );

	this.hero.render();

	var scale = 1 + Math.sin( this.tick * 0.1 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( $.game.mouse.x, $.game.mouse.y );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( this.tick * 0.05 );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( 'hsla(' + this.hero.hue + ', 100%, 70%, 0.5)' );
	$.ctx.strokeRect( -6, -6, 12, 12 );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillCircle( 0, 0, 1 );
	$.ctx.restore();
};

$.statePlay.mousedown = function( e ) {
	this.hero.warp( e.x, e.y );
};