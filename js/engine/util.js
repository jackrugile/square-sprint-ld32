/*==============================================================================

Math

==============================================================================*/

$.rand = function( min, max ) {
	return Math.random() * ( max - min ) + min;
};

$.randInt = function( min, max ) {
	return Math.floor( min + Math.random() * ( max - min + 1 ) );
};

/*==============================================================================

Collision

==============================================================================*/

$.distance = function( p1x, p1y, p2x, p2y ) {
	var dx = p1x - p2x,
		dy = p1y - p2y;
	return Math.sqrt( dx * dx + dy * dy );
};

// credit: Keith Peters - https://github.com/bit101/CodingMath
$.rangeIntersect = function( min0, max0, min1, max1 ) {
	return Math.max( min0, max0 ) >= Math.min( min1, max1 ) && Math.min( min0, max0 ) <= Math.max( min1, max1 );
};

// credit: Keith Peters - https://github.com/bit101/CodingMath
$.collide = function( r0, r1 ) {
	return $.rangeIntersect( r0.x, r0.x + r0.width, r1.x, r1.x + r1.width ) && $.rangeIntersect( r0.y, r0.y + r0.height, r1.y, r1.y + r1.height );
};

/*==============================================================================
Formatting
==============================================================================*/

$.formatCommas = function( n ) {
	n = Math.round( n );
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

$.pad = function( amount, digits ){
	amount += '';
	if( amount.length < digits ) {
		amount = '0' + amount;
		return $.pad( amount, digits );
	} else {
		return amount;
	}
};

$.msToString = function( ms ) {
	var x = ms / 1000;
	var seconds = parseInt( x % 60 );
	x /= 60;
	var minutes = parseInt( x % 60 );
	x /= 60;
	var hours = parseInt( x % 24 );
	return $.pad( hours, 2) + ':' + $.pad( minutes, 2) + ':' + $.pad( seconds, 2);
};

/*==============================================================================
Miscellaneous
==============================================================================*/

$.isString = function( variable ) {
	return typeof variable === 'string';
};

$.isObject = function( variable ) {
	return typeof variable === 'object';
};

$.isSet = function( prop ) {
	return typeof prop != 'undefined';
};

$.isObjEmpty = function( obj ) {
	for( var prop in obj ) {
		if( obj.hasOwnProperty( prop ) ) {
			return false;
		}
	}
	return true;
};

$.merge = function( obj1, obj2 ) {
	for( var prop in obj2 ) {
		obj1[ prop ] = obj2[ prop ];
	}
};