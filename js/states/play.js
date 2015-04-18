$.statePlay = {};

$.statePlay.create = function() {
	this.tick = 0;
	this.hero = new $.hero();
	this.particles = new $.pool( $.particle, 300 );
	this.pings = new $.pool( $.ping, 100 );
	this.enemies = new $.pool( $.enemy, 100 );

	this.generateLevel( 1 );
};

$.statePlay.step = function( dt ) {
	this.particles.each( 'step' );
	this.pings.each( 'step' );
	this.enemies.each( 'step' );
	this.hero.step();
	this.tick++;
};

$.statePlay.render = function( dt ) {
	//$.ctx.clear( 'hsla(' + this.hero.hue + ', 10%, 10%, 1)' );
	$.ctx.clear( '#181818' );

	this.particles.each( 'render' );
	this.pings.each( 'render' );
	this.enemies.each( 'render' );
	this.hero.render();

	var scale = 1 + Math.sin( this.tick * 0.1 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( $.game.mouse.x, $.game.mouse.y );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( this.tick * 0.05 );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( 'hsla(' + this.hero.hue + ', 100%, 70%, 0.5)' );
	$.ctx.strokeRect( -8, -8, 16, 16 );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillCircle( 0, 0, 1 );
	$.ctx.restore();
};

$.statePlay.mousedown = function( e ) {
	if( e.button == 'left' ) {
		this.hero.charge( e.x, e.y );
	} else if( e.button == 'right' ) {
		this.hero.warp( e.x, e.y );
	}
};

$.statePlay.generateLevel = function( level ) {
	var level = $.levels[ level - 1 ],
		size = parseInt( level.properties.size ),
		map = level.layers[ 0 ].data,
		width = level.width,
		height = level.height,
		padding = 10;

	for( var row = 0; row < height; row++ ) {
		for( var col = 0; col < width; col++ ) {
			var value = map[ ( row * width ) + col ];
			//console.log( value );
			//if( $.mapKey[ value ] == 'enemy' ) {
				//console.log( row );
				var enemy = this.enemies.create({
					x: col * size + padding / 2,
					y: row * size + padding / 2,
					w: size - padding,
					h: size - padding
				});
				console.log( enemy );

			//}
		}
	}
}