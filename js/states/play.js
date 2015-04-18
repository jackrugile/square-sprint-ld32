$.statePlay = {};

$.statePlay.create = function() {

	this.hero = new $.hero();
};

$.statePlay.step = function( dt ) {
	this.hero.step();
};

$.statePlay.render = function( dt ) {
	/*$.ctx.globalCompositeOperation( 'destination-out' );
	$.ctx.fillStyle( 'rgba(0, 0, 0, 1)' );
	$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
	$.ctx.globalCompositeOperation( 'lighter' );*/
	$.ctx.clear();

	this.hero.render();
};

$.statePlay.mousedown = function( e ) {
	this.hero.warp( e.x, e.y );
};