$.statePlay = {};

$.statePlay.create = function() {
	this.uiGrad = $.ctx.createLinearGradient( 0, 0, $.game.width, 0 );
	this.uiGrad .addColorStop( 0, 'hsla(0, 0%, 0%, 0.6)' );
	this.uiGrad .addColorStop( 0.2, 'hsla(0, 0%, 0%, 0)' );
	this.uiGrad .addColorStop( 0.8, 'hsla(0, 0%, 0%, 0)' );
	this.uiGrad .addColorStop( 1, 'hsla(0, 0%, 0%, 0.6)' );
};

$.statePlay.enter = function() {
	this.lightPosition = { x: 0, y: 0 };

	this.shake = {
		translate: 0,
		rotate: 0
	};

	this.levelFlashTick = 0;
	this.levelFlashTickMax = 100;

	this.level = null;
	this.levelNumber = location.hash ? parseInt( location.hash.substring( 1 ) ) : 1;
	this.levelTotal = $.levels.length;
	this.generateLevel( this.levelNumber );

	this.endStateTick = 0;
	this.endStateTickMax = 60;

	this.elapsed = 0;
	this.totalClicks = 0;

	this.leftState = false;
}

$.statePlay.exit = function() {
	this.leftState = true;
	this.cleanUpLevel();
};

$.statePlay.step = function( dt ) {
	if( this.leftState ) {
		return;
	}

	this.elapsed += dt;

	this.walls.each( 'step' );
	this.enemies.each( 'step' );
	this.particles.each( 'step' );
	this.pings.each( 'step' );
	this.hero.step();

	this.level.progress += ( ( this.level.killed / this.level.total ) - this.level.progress ) * 0.3;

	if( this.level.progress >= 0.999 ) {
		if( this.levelNumber < this.levelTotal ) {
			this.cleanUpLevel();
			this.levelNumber++;
			this.generateLevel( this.levelNumber );
		} else {
			if( this.endStateTick >= this.endStateTickMax ) {
				$.game.lastRoundTime = this.elapsed;
				$.game.lastRoundClicks = this.totalClicks;
				$.game.setState( $.stateVictory );
			} else {
				this.shake.translate += 0.2;
				this.endStateTick++;
			}
		}
	}

	this.lightPosition.x += ( this.hero.x - 900 - this.lightPosition.x ) * 0.2;
	this.lightPosition.y += ( this.hero.y - 600 - this.lightPosition.y ) * 0.2;

	if( this.shake.translate > 0 ) {
		this.shake.translate *= 0.92;
	}

	if( this.shake.rotate > 0 ) {
		this.shake.rotate *= 0.92;
	}

	if( this.levelFlashTick > 0 ) {
		this.levelFlashTick *= 0.92;
	}


	this.tick++;
};

$.statePlay.render = function( dt ) {
	if( this.leftState ) {
		return;
	}
	$.ctx.clear( $.game.clearColor );

	$.ctx.save();
	if( this.shake.translate || this.shake.rotate ) {
		$.ctx.translate( $.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ), $.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ) );
		$.ctx.rotate( $.rand( -this.shake.rotate, this.shake.rotate ) );
		$.ctx.translate( -$.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ) , -$.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ));
	}
	this.walls.each( 'render' );
	this.enemies.each( 'render' );
	this.particles.each( 'render' );
	this.pings.each( 'render' );
	this.hero.render();
	$.ctx.restore();

	$.ctx.drawImage( $.game.images[ 'light' ], this.lightPosition.x, this.lightPosition.y );

	if( this.levelFlashTick > 0.005 ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + ( this.levelFlashTick / this.levelFlashTickMax ) + ')' );
		$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
		$.ctx.save();
		$.ctx.translate( $.game.width / 2, $.game.height / 2 );
		var scale = 3 - ( this.levelFlashTick / this.levelFlashTickMax ) * 2;
		$.ctx.scale( scale, scale );
		$.ctx.font( '100px droidsansmono' );
		$.ctx.textBaseline( 'top' );
		$.ctx.textAlign( 'center' );
		$.ctx.fillStyle( 'hsla(' + this.level.hue + ', 90%, ' + ( 90 - ( this.levelFlashTick / this.levelFlashTickMax ) * 40 ) + '%, ' + ( this.levelFlashTick / ( this.levelFlashTickMax / 3 ) ) + ')' );
		$.ctx.fillText( this.levelNumber, 0, -75 );
		$.ctx.restore();
	}

	if( this.endStateTick > 0 ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, ' + ( this.endStateTick / this.endStateTickMax ) + ')' );
		$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
	}

	$.ctx.fillStyle( this.uiGrad );
	$.ctx.fillRect( 0, $.game.height, $.game.width, -29 );

	$.ctx.font( '12px droidsansmono' );
	$.ctx.textBaseline( 'top' );
	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 1)' );
	$.ctx.textAlign( 'left' );
	$.ctx.fillText( 'TIME ' + $.msToString( this.elapsed * 1000 ), 14, 577 );
	$.ctx.textAlign( 'right' );
	$.ctx.fillText( 'LEVEL ' + this.levelNumber + '/' + this.levelTotal, $.game.width - 14, 577 );

	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
	$.game.renderCursor();

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 1)' );
	$.ctx.fillRect( 0, $.game.height - 1, this.level.progress * $.game.width, 1 );
};

$.statePlay.mousedown = function( e ) {
	if( e.button == 'left' ) {
		this.hero.charge( e.x, e.y );
	} else if( e.button == 'right' ) {
		this.hero.warp( e.x, e.y );
	}
	this.totalClicks++;
};

$.statePlay.keydown = function( e ) {
	if( e.key == 'escape' ) {
		$.game.setState( $.stateMenu );
	}
};

$.statePlay.generateLevel = function( level ) {
	this.tick = 0;

	this.levelFlashTick = this.levelFlashTickMax;

	this.level = {};
	this.level.data = $.levels[ level - 1 ];
	this.level.size = parseInt( this.level.data.properties.size );
	this.level.map = this.level.data.layers[ 0 ].data;
	this.level.width = this.level.data.width;
	this.level.height = this.level.data.height;
	this.level.hue = parseInt( this.level.data.properties.hue );
	this.level.progress = 0;
	this.level.total = 0;
	this.level.killed = 0;
	this.level.padding = 0;

	this.walls = new $.pool( $.wall, 100 );
	this.enemies = new $.pool( $.enemy, 100 );
	this.particles = new $.pool( $.particle, 300 );
	this.pings = new $.pool( $.ping, 100 );
	this.hero = new $.hero();

	for( var row = 0; row < this.level.height; row++ ) {
		for( var col = 0; col < this.level.width; col++ ) {
			var value = this.level.map[ ( row * this.level.width ) + col ] - 1;
			
			// empty
			if( $.mapKey[ value ] == 'empty' ) {
			}

			// wall
			if( $.mapKey[ value ] == 'wall' ) {
				this.walls.create({
					x: col * this.level.size,
					y: row * this.level.size,
					w: this.level.size,
					h: this.level.size
				});
			}

			// enemy
			if( $.mapKey[ value ] == 'enemy' ) {
				this.enemies.create({
					x: col * this.level.size,
					y: row * this.level.size,
					w: this.level.size,
					h: this.level.size
				});
				this.level.total++;
			}

			// hero start
			if( $.mapKey[ value ] == 'start' ) {
				this.hero.x = col * this.level.size + this.level.size / 2;
				this.hero.y = row * this.level.size + this.level.size / 2;
			}
		}
	}
};

$.statePlay.cleanUpLevel = function( level ) {
	this.walls = null;
	this.enemies = null;
	this.particles = null;
	this.pings = null;
	this.hero = null;
};