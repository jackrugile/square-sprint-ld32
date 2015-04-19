$.stateVictory = {};

$.stateVictory.create = function() {
};

$.stateVictory.enter = function() {
	this.tick = 0;
	this.particles = new $.pool( $.particle, 100 );

	if( $.game.lastRoundTime < $.storage.get( 'fastestRun' ) || $.storage.get( 'fastestRun' ) == 0 ) {
		$.storage.set( 'fastestRun', $.game.lastRoundTime );
	}
	$.storage.set( 'totalTime', $.storage.get( 'totalTime' ) + $.game.lastRoundTime );
	$.storage.set( 'totalClicks', $.storage.get( 'totalClicks' ) + $.game.lastRoundClicks );
};

$.stateVictory.exit = function() {
	this.particles = null;
};

$.stateVictory.step = function( dt ) {
	this.tick++;

	this.particles.each( 'step' );

	this.particles.create({
		x: $.rand( 0, $.game.width ),
		y: $.rand( 0, $.game.height ),
		vx: $.rand( -0.25, 0.25 ),
		vy: $.rand( -0.25, -1 ),
		decay: 0.004,
		hue: 0,
		desaturated: true
	});
};

$.stateVictory.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	this.particles.each( 'render' );

	$.ctx.font( '60px droidsansmono' );
	$.ctx.textAlign( 'center' );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillText( 'THE END', $.game.width / 2, 220 );

	$.ctx.font( '18px droidsansmono' );
	$.ctx.textAlign( 'center' );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillText( 'TIME / ' + $.msToString( $.game.lastRoundTime * 1000 ), $.game.width / 2, 300 );
	$.ctx.fillText( 'CLICKS / ' + $.formatCommas( $.game.lastRoundClicks ), $.game.width / 2, 330 );


	$.ctx.drawImage( $.game.images[ 'light' ], $.game.width / 2 - 900 + Math.sin( this.tick / 100 ) * 200, $.game.height / 2 - 600 + Math.cos( this.tick / 175 ) * 75 );
	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
	$.game.renderCursor();
};

$.stateVictory.mousedown = function( e ) {
	if( this.tick > 50 ) {
		$.game.setState( $.stateMenu );
	}
};