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
	this.hue = 120;
};

$.hero.prototype.step = function() {
	//this.hue++;
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
					decay: 0.01
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
			decay: 0.02
		});
	}

	this.ox = this.x;
	this.oy = this.y;
};

$.hero.prototype.render = function() {
	if( this.chargingTail ) {
		/*for( var i = 0; i < 5; i++ ) {
			$.ctx.beginPath();
			$.ctx.moveTo( this.chargeTailTween.before[ 0 ], this.chargeTailTween.before[ 1 ] );
			$.ctx.lineTo( this.x + $.rand(-this.diag, this.diag), this.y + $.rand(-this.diag, this.diag) );
			$.ctx.lineWidth( 1 )
			$.ctx.strokeStyle( 'hsla(' + this.hue + ', 100%, 80%, ' + $.rand( 0.5, 1 ) + ')' );
			$.ctx.stroke();
		}*/

		$.ctx.beginPath();
		$.ctx.moveTo( this.chargeTailTween.before[ 0 ], this.chargeTailTween.before[ 1 ] );
		$.ctx.lineTo( this.x, this.y );
		$.ctx.lineWidth( 1 )
		$.ctx.strokeStyle( 'hsla(' + this.hue + ', 100%, 80%, ' + ( 1 - this.chargeTween.progress ) + ')' );
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
		grad.addColorStop( 0, 'hsla(' + this.hue + ', 90%, 85%, 1)' );
		grad.addColorStop( 1, 'hsla(' + this.hue + ', 90%, 55%, 1)' );

		$.ctx.beginPath();
		$.ctx.moveTo( p1.x, p1.y );
		$.ctx.lineTo( p2.x, p2.y );
		$.ctx.lineTo( p3.x, p3.y );
		$.ctx.closePath();
		$.ctx.fillStyle( grad );
		$.ctx.fill();

		$.ctx.beginPath();
		$.ctx.arc( this.x + $.rand( -3, 3 ), this.y + $.rand( -3, 3 ), this.radius * 3 + $.rand( -10, 10 ), this.chargeTweenAngle - Math.PI * 0.4 + $.rand( -0.2, 0.2 ), this.chargeTweenAngle + Math.PI * 0.4 + $.rand( -0.2, 0.2 ), false );
		$.ctx.lineWidth( $.rand( 1, 2 ) );
		$.ctx.strokeStyle( 'hsla(' + this.hue + ', 100%, ' + $.rand( 50, 90 ) + '%, ' + $.rand( 0.05, 0.25 ) + ')' );
		$.ctx.stroke();
	}

	if( this.chargingTail ) {
		$.ctx.fillStyle( 'hsla(' + this.hue + ', 90%, 55%, 1)' );
	} else {
		$.ctx.fillStyle( 'hsla(' + this.hue + ', 90%, ' + ( ( 0.25 + this.pulsing * 0.5 ) * 100 ) + '%, 1)' );
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
	//$.ctx.fillCircle( this.x, this.y, this.radius );
};

$.hero.prototype.handleMovement = function() {
	if( this.charging || this.warping ) {
		return;
	}

	if( $.game.keyboard.keys.w || $.game.keyboard.keys.up ) {
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
	}

	if( this.chargingTail ) {
		this.chargeTailTween.end();
	}

	this.vx *= this.drag;
	this.vy *= this.drag;

	this.x += this.vx;
	this.y += this.vy;
};

$.hero.prototype.charge = function( x, y ) {
	this.vx = 0;
	this.vy = 0;
	x = Math.min( $.game.width - this.diag, Math.max( this.diag, x ) );
	y = Math.min( $.game.height - this.diag, Math.max( this.diag, y ) );
	if( this.charging ) {
		this.chargeTween.end();
	}
	this.chargeTween = $.game.tween( this ).to( { x: x, y: y }, 0.2, 'outExpo' );

	this.chargeTail.x = this.x;
	this.chargeTail.y = this.y;
	if( this.chargingTail ) {
		this.chargeTailTween.end();
	}
	//this.chargeTailTween = $.game.tween( this.chargeTail ).to( { x: x, y: y }, 0.5, 'inExpo' );
	this.chargeTailTween = $.game.tween( this.chargeTail ).to( { x: x, y: y }, 1.2, 'outExpo' );

	var dx = x - this.x,
		dy = y - this.y;
	this.chargeTweenDistance = Math.sqrt( dx * dx + dy * dy );
	this.chargeTweenAngle = Math.atan2( dy, dx );

	var sound = $.game.playSound( 'charge1' );
	$.game.sound.setPlaybackRate( sound, 0.25 + ( this.chargeTweenDistance / $.game.width ) * 0.75 );
};

$.hero.prototype.warp = function( x, y ) {
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

	this.warpTween = $.game.tween( this )
		.to( { radius: 0 }, 0.15, 'inBack' )
		.to( { x: x, y: y }, 0.001, 'linear' )
		.to( { radius: this.radiusBase }, 0.15, 'outBack' );

	var dx = x - this.x,
		dy = y - this.y;
	this.warpDistance = Math.sqrt( dx * dx + dy * dy );
	this.warpAngle = Math.atan2( dy, dx );

	var sound = $.game.playSound( 'warp1' );
	$.game.sound.setVolume( sound, 0.1 );
	$.game.sound.setPlaybackRate( sound, 0.9 + ( this.warpDistance / $.game.width ) * 1.1 );
};