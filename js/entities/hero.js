$.hero = function( opt ) { 
	$.merge( this, opt );
	this.x = $.game.width / 2;
	this.y = $.game.height / 2;
	this.vx = 0;
	this.vy = 0;
	this.vmax = 4;
	this.accel = 0.75;
	this.drag = 0.9;
	this.radius = 8;
	this.warpTween = null;
	this.warpTweenAngle = 0;
	this.warping = false;
	this.warpTail = {
		x: 0,
		y: 0
	};
	this.warpingTail = false;
	this.warpTailTween = null;
	this.pulsing = 1;
};

$.hero.prototype.step = function() {
	if( this.warpTween && this.warpTween.finished != true ) {
		this.warping = true;
	} else {
		this.warping = false;
	}

	if( this.warpTailTween && this.warpTailTween.finished != true ) {
		this.warpingTail = true;
	} else {
		this.warpingTail = false;
	}

	this.handleMovement();

	this.pulsing = 0.5 + Math.sin( $.game.lifetime * 6 ) * 0.5;
};

$.hero.prototype.render = function() {
	if( this.warpingTail ) {
		var p1 = {
				//x: this.warpTween.before[ 0 ],
				//y: this.warpTween.before[ 1 ]
				x: this.warpTail.x,
				y: this.warpTail.y
			},
			p2 = {
				x: this.x + Math.cos( this.warpTweenAngle + Math.PI / 2 ) * this.radius,
				y: this.y + Math.sin( this.warpTweenAngle + Math.PI / 2 ) * this.radius
			},
			p3 = {
				x: this.x - Math.cos( this.warpTweenAngle + Math.PI / 2 ) * this.radius,
				y: this.y - Math.sin( this.warpTweenAngle + Math.PI / 2 ) * this.radius
			};

		$.ctx.beginPath();
		$.ctx.moveTo( p1.x, p1.y );
		$.ctx.lineTo( p2.x, p2.y );
		$.ctx.lineTo( p3.x, p3.y );
		$.ctx.closePath();
		//$.ctx.fillStyle( 'hsla(0, 100%, ' + $.rand( 10, 100 ) + '%, 1)' )
		$.ctx.fillStyle( '#ff3' );
		$.ctx.fill();
	}

	if( this.warping ) {
		$.ctx.fillStyle( '#ff3' );
	} else {
		$.ctx.fillStyle( 'hsla(60, 100%, ' + ( ( 0.25 + this.pulsing * 0.75 ) * 100 ) + '%, 1)' );
	}
	$.ctx.fillCircle( this.x, this.y, this.radius  );
};

$.hero.prototype.handleMovement = function() {
	if( this.warping ) {
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
		verticalDown = true;
	}

	this.vx *= this.drag;
	this.vy *= this.drag;

	this.x += this.vx;
	this.y += this.vy;
};

$.hero.prototype.warp = function( x, y ) {
	this.vx = 0;
	this.vy = 0;
	x = Math.min( $.game.width, Math.max( 0, x ) );
	y = Math.min( $.game.height, Math.max( 0, y ) );
	if( this.warping ) {
		this.warpTween.end();
	}
	this.warpTween = $.game.tween( this ).to( { x: x, y: y }, 0.3, 'outExpo' );

	this.warpTail.x = this.x;
	this.warpTail.y = this.y;
	if( this.warpingTail ) {
		this.warpTailTween.end();
	}
	this.warpTailTween = $.game.tween( this.warpTail ).to( { x: x, y: y }, 0.4, 'inExpo' );

	var dx = x - this.x,
		dy = y - this.y;
	this.warpTweenAngle = Math.atan2( dy, dx );
};