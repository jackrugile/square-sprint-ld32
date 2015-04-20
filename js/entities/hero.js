$.hero = function( opt ) { 
	$.merge( this, opt );
	this.x = $.game.width / 2;
	this.y = $.game.height / 2;
	this.ox = this.x;
	this.oy = this.y;
	this.vx = 0;
	this.vy = 0;
	this.vmax = 4;
	this.accel = 0.75;
	this.drag = 0.9;
	this.radius = 8;
	this.radiusBase = this.radius;
	this.diag = this.radius * Math.sqrt( 2 );
	
	this.chargeTween = null;
	this.chargeTweenAngle = 0;
	this.chargeTweenDistance = 0;
	this.charging = false;
	this.chargeTail = {
		x: 0,
		y: 0
	};
	this.chargingTail = false;
	this.chargeTailTween = null;

	this.warpTween = null;
	this.warping = false;
	this.warpDistance = 0;
	this.warpAngle = 0;

	this.pulsing = 1;
	this.mouseAngle = 0;
	this.renderAngle = 0;
};

$.hero.prototype.step = function() {
	if( this.chargeTween && this.chargeTween.finished != true ) {
		this.charging = true;
	} else {
		this.charging = false;
	}

	if( this.chargeTailTween && this.chargeTailTween.finished != true ) {
		this.chargingTail = true;
	} else {
		this.chargingTail = false;
	}

	if( this.warpTween && this.warpTween.finished != true ) {
		this.warping = true;
	} else {
		this.warping = false;
	}

	this.handleMovement();

	this.pulsing = 0.5 + Math.sin( $.game.lifetime * 6 ) * 0.5;

	var dx = $.game.mouse.x - this.x,
		dy = $.game.mouse.y - this.y;
	this.mouseAngle = Math.atan2( dy, dx );

	if( this.charging ) {
		var dx = Math.abs( this.x - this.ox ),
			dy = Math.abs( this.y - this.oy );

		if( dx > 0 && dy > 0 ) {
			var dist = $.distance( this.chargeTail.x, this.chargeTail.y, this.x, this.y );
			for( var i = 0; i < Math.ceil( this.chargeTweenDistance / 100 ); i++ ) {
				var radius = $.rand( 0, dist ),
					x = this.chargeTail.x + Math.cos( this.chargeTweenAngle ) * radius,
					y = this.chargeTail.y + Math.sin( this.chargeTweenAngle ) * radius,
					angle = this.chargeTweenAngle + Math.PI + $.rand( -0.1, 0.1 ),
					speed = 1 + $.rand( -0.5, 0.5 );
				$.game.state.particles.create({
					x: x,
					y: y,
					vx: Math.cos( angle ) * speed,
					vy: Math.sin( angle ) * speed,
					decay: 0.01,
					hue: $.game.state.level.hue,
					desaturated: false
				});
			}
		}
	}

	if( $.game.state.tick % 2 == 0 ) {
		$.game.state.particles.create({
			x: this.x + $.rand( -this.radius, this.radius ),
			y: this.y + $.rand( -this.radius, this.radius ),
			vx: -this.vx * 0.2 + $.rand( -0.5, 0.5 ),
			vy: -this.vy * 0.2 + $.rand( -0.5, 0.5 ),
			decay: 0.02,
			hue: $.game.state.level.hue,
			desaturated: false
		});
	}

	this.ox = this.x;
	this.oy = this.y;
};

$.hero.prototype.render = function() {
	if( this.chargingTail ) {
		$.ctx.beginPath();
		$.ctx.moveTo( this.chargeTailTween.before[ 0 ], this.chargeTailTween.before[ 1 ] );
		$.ctx.lineTo( this.x, this.y );
		$.ctx.lineWidth( 1 )
		$.ctx.strokeStyle( 'hsla(' + $.game.state.level.hue + ', 100%, 80%, ' + ( 1 - this.chargeTween.progress ) + ')' );
		$.ctx.stroke();

		var diag = 
			p1 = {
				x: this.chargeTail.x,
				y: this.chargeTail.y
			},
			p2 = {
				x: this.x + Math.cos( this.chargeTweenAngle + Math.PI / 2 ) * this.diag,
				y: this.y + Math.sin( this.chargeTweenAngle + Math.PI / 2 ) * this.diag
			},
			p3 = {
				x: this.x - Math.cos( this.chargeTweenAngle + Math.PI / 2 ) * this.diag,
				y: this.y - Math.sin( this.chargeTweenAngle + Math.PI / 2 ) * this.diag
			};

		var grad = $.ctx.createLinearGradient( p1.x, p1.y, this.x, this.y );
		grad.addColorStop( 0, 'hsla(' + $.game.state.level.hue + ', 90%, 90%, 1)' );
		grad.addColorStop( 1, 'hsla(' + $.game.state.level.hue + ', 90%, 60%, 1)' );

		$.ctx.beginPath();
		$.ctx.moveTo( p1.x, p1.y );
		$.ctx.lineTo( p2.x, p2.y );
		$.ctx.lineTo( p3.x, p3.y );
		$.ctx.closePath();
		$.ctx.fillStyle( grad );
		$.ctx.fill();

		$.ctx.beginPath();
		$.ctx.arc( this.x + $.rand( -1, 1 ), this.y + $.rand( -1, 1 ), Math.max( 0, this.radius * 3 + $.rand( -5, 5 ) ), this.chargeTweenAngle - Math.PI * 0.4 + $.rand( -0.1, 0.1 ), this.chargeTweenAngle + Math.PI * 0.4 + $.rand( -0.1, 0.1 ), false );
		$.ctx.lineWidth( $.rand( 1, 2 ) );
		$.ctx.strokeStyle( 'hsla(' + $.game.state.level.hue + ', 100%, ' + $.rand( 50, 90 ) + '%, ' + $.rand( 0.05, 0.25 ) + ')' );
		$.ctx.stroke();
	}

	if( this.chargingTail ) {
		$.ctx.fillStyle( 'hsla(' + $.game.state.level.hue + ', 90%, 60%, 1)' );
	} else {
		$.ctx.fillStyle( 'hsla(' + $.game.state.level.hue + ', 90%, ' + ( ( 0.25 + this.pulsing * 0.5 ) * 100 ) + '%, 1)' );
	}
	
	$.ctx.save()
	$.ctx.translate( this.x, this.y );
	if( this.chargingTail ) {
		$.ctx.rotate( this.chargeTweenAngle + Math.PI / 4 );
	} else {
		$.ctx.rotate( this.mouseAngle + Math.PI / 4 );
	}
	$.ctx.fillRect( -this.radius, -this.radius, this.radius * 2, this.radius * 2 );
	$.ctx.restore();
};

$.hero.prototype.handleMovement = function() {
	if( this.charging || this.warping ) {
		return;
	}

	/*if( $.game.keyboard.keys.w || $.game.keyboard.keys.up ) {
		if( this.vy > -this.vmax ) {
			this.vy -= this.accel;
		}
	}
	if( $.game.keyboard.keys.d || $.game.keyboard.keys.right ) {
		if( this.vx < this.vmax ) {
			this.vx += this.accel;
		}
	}
	if( $.game.keyboard.keys.s || $.game.keyboard.keys.down ) {
		if( this.vy < this.vmax ) {
			this.vy += this.accel;
		}
	}
	if( $.game.keyboard.keys.a || $.game.keyboard.keys.left ) {
		if( this.vx > -this.vmax ) {
			this.vx -= this.accel;
		}
	}*/

	if( this.chargingTail ) {
		this.chargeTailTween.end();
	}

	/*this.vx *= this.drag;
	this.vy *= this.drag;

	this.x += this.vx;
	this.y += this.vy;*/
};

$.hero.prototype.charge = function( x, y ) {
	if( this.checkWallCollision( x, y, true ) || !this.checkScreenCollision( x, y ) ) {
		var sound = $.game.playSound( 'error1' );
		$.game.sound.setVolume( sound, 0.6 );
		$.game.sound.setPlaybackRate( sound, 0.9 + $.rand( -0.1, 0.1 ) );
		return;
	}

	this.vx = 0;
	this.vy = 0;
	x = Math.min( $.game.width - this.diag, Math.max( this.diag, x ) );
	y = Math.min( $.game.height - this.diag, Math.max( this.diag, y ) );
	if( this.charging ) {
		this.chargeTween.end();
	}
	this.chargeTween = $.game.tween( this ).to( { x: x, y: y }, 0.3, 'outExpo' );

	this.chargeTail.x = this.x;
	this.chargeTail.y = this.y;
	if( this.chargingTail ) {
		this.chargeTailTween.end();
	}
	//this.chargeTailTween = $.game.tween( this.chargeTail ).to( { x: x, y: y }, 0.5, 'inExpo' );
	this.chargeTailTween = $.game.tween( this.chargeTail ).to( { x: x, y: y }, 1.8, 'outExpo' );

	var dx = x - this.x,
		dy = y - this.y;
	this.chargeTweenDistance = Math.sqrt( dx * dx + dy * dy );
	this.chargeTweenAngle = Math.atan2( dy, dx );

	var sound = $.game.playSound( 'charge1' );
	$.game.sound.setVolume( sound, 1.3 );
	$.game.sound.setPlaybackRate( sound, 0.25 + ( this.chargeTweenDistance / $.game.width ) * 0.75 );
};

$.hero.prototype.warp = function( x, y ) {
	if( this.checkWallCollision( x, y, false ) || !this.checkScreenCollision( x, y ) ) {
		var sound = $.game.playSound( 'error1' );
		$.game.sound.setVolume( sound, 0.3 );
		$.game.sound.setPlaybackRate( sound, 0.9 + $.rand( -0.1, 0.1 ) );
		return;
	}

	this.vx = 0;
	this.vy = 0;
	x = Math.min( $.game.width - this.diag, Math.max( this.diag, x ) );
	y = Math.min( $.game.height - this.diag, Math.max( this.diag, y ) );

	$.game.state.pings.create({
		x: x,
		y: y,
		grow: true
	});

	$.game.state.pings.create({
		x: this.x,
		y: this.y,
		grow: false
	});

	if( this.warping ) {
		this.warpTween.end();
	}

	if( this.chargingTail ) {
		this.chargeTailTween.end();
	}

	this.x = x;
	this.y = y;

	var dx = x - this.x,
		dy = y - this.y;
	this.warpDistance = Math.sqrt( dx * dx + dy * dy );
	this.warpAngle = Math.atan2( dy, dx );

	var sound = $.game.playSound( 'warp1' );
	$.game.sound.setVolume( sound, 0.2 );
	$.game.sound.setPlaybackRate( sound, 0.9 + ( this.warpDistance / $.game.width ) * 1.1 );
};

$.hero.prototype.checkScreenCollision = function( x, y ) {
	return $.pointInRect( x, y, 0, 0, $.game.width, $.game.height );
};

$.hero.prototype.checkWallCollision = function( x, y, through ) {
	var foundCollision = false;

	for( var i = 0; i < $.game.state.walls.length; i++ ) {
		var wall = $.game.state.walls.alive[ i ];
		if( $.pointInRect( x, y, wall.x, wall.y, wall.w, wall.h ) ) {
			wall.clickTick = wall.clickTickMax;
			foundCollision = true;
		}
	}

	if( foundCollision ) {
		return true;
	}

	for( var i = 0; i < $.game.state.walls.length; i++ ) {
		var wall = $.game.state.walls.alive[ i ];
		/*if( $.pointInRect( x, y, wall.x, wall.y, wall.w, wall.h ) ) {
			wall.clickTick = wall.clickTickMax;
			return true;
		}*/

		if( through ) {
			var tl = { x: wall.x, y: wall.y },
				tr = { x: wall.x + wall.w, y: wall.y },
				bl = { x: wall.x, y: wall.y + wall.h },
				br = { x: wall.x + wall.w, y: wall.y + wall.h },
				h1 = { x: this.x, y: this.y },
				h2 = { x: x, y: y };
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
			}
		}
	}
	return false;
};