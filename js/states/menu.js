$.stateMenu = {};

$.stateMenu.create = function() {
	this.tick = 0;

	this.particles = new $.pool( $.particle, 100 );
};

$.stateMenu.step = function( dt ) {
	this.tick++;

	this.particles.each( 'step' );

	if( this.tick % 3 == 0 ) {
		this.particles.create({
			x: $.rand( 100, 800 ),
			y: $.rand( 120, 340 ),
			vx: $.rand( -0.25, 0.25 ),
			vy: $.rand( -0.25, -0.5 ),
			decay: 0.005,
			hue: 0,
			desaturated: true
		});
	}
};

$.stateMenu.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	this.particles.each( 'render' );
	
	$.ctx.drawImage( $.game.images[ 'title' ], 100, 80 );

	$.ctx.font( '13px droidsansmono' );
	$.ctx.textBaseline( 'top' );

	$.ctx.textAlign( 'right' );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillText( 'Built for Ludum Dare 32', 280, 445 );
	$.ctx.fillStyle( '#bbb' );
	$.ctx.fillText( 'An Unconventional Weapon', 280, 470 );
	$.ctx.fillStyle( '#888' );
	$.ctx.fillText( 'Made by Jack Rugile', 280, 495 );
	
	$.ctx.textAlign( 'left' );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillText( 'Built for Ludum Dare 32', 620, 445 );
	$.ctx.fillStyle( '#bbb' );
	$.ctx.fillText( 'An Unconventional Weapon', 620, 470 );
	$.ctx.fillStyle( '#888' );
	$.ctx.fillText( 'Made by Jack Rugile', 620, 495 );

	$.ctx.fillStyle( '#fff' );
	$.ctx.fillRect( 340, 440, 220, 80 );
	$.ctx.font( '40px droidsansmono' );
	$.ctx.textAlign( 'center' );
	$.ctx.fillStyle( '#222' );
	$.ctx.fillText( 'Play', $.game.width / 2, 452 );


	$.game.renderCursor();
	$.ctx.drawImage( $.game.images[ 'light' ], $.game.width / 2 - 900 + Math.sin( this.tick / 150 ) * 300, $.game.height / 2 - 700 + Math.cos( this.tick / 175 ) * 75 );
	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
};

$.stateMenu.mousedown = function( e ) {
	$.game.setState( $.statePlay );
};