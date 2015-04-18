$.hero = function( opt ) { 
	$.merge( this, opt );
	this.x = $.game.width / 2;
	this.y = $.game.height / 2;
	this.vx = 0;
	this.vy = 0;
	this.vmax = 4;
	this.accel = 0.75;
	this.drag = 0.9;
	this.radius = 6;
	this.diag = this.radius * Math.sqrt( 2 );
	this.warpTween = null;
	this.warpTweenAngle = 0;
	this.warpTweenDistance = 0;
	this.warping = false;
	this.warpTail = {
		x: 0,
		y: 0
	};
	this.warpingTail = false;
	this.warpTailTween = null;
	this.pulsing = 1;
	this.mouseAngle = 0;
	this.renderAngle = 0;
	this.hue = 120;
};

$.hero.prototype.step = function() {
	this.hue++;
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

	var dx = $.game.mouse.x - this.x,
		dy = $.game.mouse.y - this.y;
	this.mouseAngle = Math.atan2( dy, dx );
};

$.hero.prototype.render = function() {
	$.ctx.beginPath();
	$.ctx.moveTo( $.game.mouse.x, $.game.mouse.y );
	$.ctx.lineTo( this.x, this.y );
	$.ctx.strokeStyle( 'hsla(' + this.hue + ', 100%, 70%, 0.3)' );
	$.ctx.stroke();

	if( this.warpingTail ) {
		var diag = 
			p1 = {
				x: this.warpTail.x,
				y: this.warpTail.y
			},
			p2 = {
				x: this.x + Math.cos( this.warpTweenAngle + Math.PI / 2 ) * this.diag,
				y: this.y + Math.sin( this.warpTweenAngle + Math.PI / 2 ) * this.diag
			},
			p3 = {
				x: this.x - Math.cos( this.warpTweenAngle + Math.PI / 2 ) * this.diag,
				y: this.y - Math.sin( this.warpTweenAngle + Math.PI / 2 ) * this.diag
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
	}

	if( this.warpingTail ) {
		$.ctx.fillStyle( 'hsla(' + this.hue + ', 90%, 55%, 1)' );
	} else {
		$.ctx.fillStyle( 'hsla(' + this.hue + ', 90%, ' + ( ( 0.25 + this.pulsing * 0.5 ) * 100 ) + '%, 1)' );
	}
	
	$.ctx.save()
	$.ctx.translate( this.x, this.y );
	if( this.warpingTail ) {
		$.ctx.rotate( this.warpTweenAngle + Math.PI / 4 );
	} else {
		$.ctx.rotate( this.mouseAngle + Math.PI / 4 );
	}
	$.ctx.fillRect( -this.radius, -this.radius, this.radius * 2, this.radius * 2 );
	$.ctx.restore();
	//$.ctx.fillCircle( this.x, this.y, this.radius );
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
	x = Math.min( $.game.width - this.diag, Math.max( this.diag, x ) );
	y = Math.min( $.game.height - this.diag, Math.max( this.diag, y ) );
	if( this.warping ) {
		this.warpTween.end();
	}
	this.warpTween = $.game.tween( this ).to( { x: x, y: y }, 0.2, 'outExpo' );

	this.warpTail.x = this.x;
	this.warpTail.y = this.y;
	if( this.warpingTail ) {
		this.warpTailTween.end();
	}
	//this.warpTailTween = $.game.tween( this.warpTail ).to( { x: x, y: y }, 0.5, 'inExpo' );
	this.warpTailTween = $.game.tween( this.warpTail ).to( { x: x, y: y }, 1.4, 'outExpo' );

	var dx = x - this.x,
		dy = y - this.y;
	this.warpTweenDistance = Math.sqrt( dx * dx + dy * dy );
	this.warpTweenAngle = Math.atan2( dy, dx );

	var sound = $.game.playSound( 'warp' );
	$.game.sound.setPlaybackRate( sound, 0.25 + ( this.warpTweenDistance / $.game.width ) * 0.75 );
};