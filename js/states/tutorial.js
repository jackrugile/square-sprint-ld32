$.stateTutorial = {};

$.stateTutorial.create = function() {
};

$.stateTutorial.enter = function() {
	this.tick = 0;
	this.particles = new $.pool( $.particle, 100 );
};

$.stateTutorial.exit = function() {
	this.particles = null;
};

$.stateTutorial.step = function( dt ) {
	this.tick++;

	this.particles.each( 'step' );

	if( this.tick % 3 == 0 ) {
		this.particles.create({
			x: $.rand( 0, $.game.width ),
			y: $.rand( 0, $.game.height ),
			vx: $.rand( -0.25, 0.25 ),
			vy: $.rand( -0.25, -1 ),
			decay: 0.004,
			hue: 0,
			desaturated: true
		});
	}

	if( this.tick > 200 ) {
		$.game.setState( $.statePlay );
	}
};

$.stateTutorial.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	this.particles.each( 'render' );

	$.ctx.align( 1, 0 ).drawImage( $.game.images[ 'left-mouse' ], $.game.width / 2 - 160, 80 ).realign();
	$.ctx.drawImage( $.game.images[ 'right-mouse' ], $.game.width / 2 + 160, 80 );

	$.ctx.fillStyle( '#fff' );
	$.ctx.font( '13px droidsansmono' );
	$.ctx.textBaseline( 'top' );
	$.ctx.textAlign( 'center' );
	$.ctx.fillText( 'LEFT CLICK TO CHARGE', $.game.width / 2 - 183, 370);
	$.ctx.fillText( 'RIGHT CLICK TO WARP', $.game.width / 2 + 183, 370);

	$.ctx.drawImage( $.game.images[ 'light' ], $.game.width / 2 - 1000 + Math.sin( this.tick / 150 ) * 100, $.game.height / 2 - 600 );
	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
	$.game.renderCursor();
};