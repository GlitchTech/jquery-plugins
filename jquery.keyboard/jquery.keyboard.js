/**
 * jQuery Keyboard plugin
 * On screen keyboard writes content to almost any html elemenent. Works best with textarea, input[type=text], and div
 * Based on http://net.tutsplus.com/tutorials/javascript-ajax/creating-a-keyboard-with-css-and-jquery/
 *
 * @requires jQuery
 * @requires jQueryUI
 *
 * @author Matthew Schott <ryltar@ku.edu>
------------------------------------------------------------------------
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
------------------------------------------------------------------------
 */

var methods = {
	init: function( options ) {

		var defaults = {
				//Common options
				toggleButton: true,

				//Uncommon options
				containerClass: "_kc",
				rowClass: "keyboard-row",

				keyboardJSON: [
					[
						{ type: "visibility" }
					], [
						{ type: "symbol", on: "~", off: "`" },
						{ type: "symbol", on: "!", off: "1" },
						{ type: "symbol", on: "@", off: "2" },
						{ type: "symbol", on: "#", off: "3" },
						{ type: "symbol", on: "$", off: "4" },
						{ type: "symbol", on: "%", off: "5" },
						{ type: "symbol", on: "^", off: "6" },
						{ type: "symbol", on: "&amp;", off: "7" },
						{ type: "symbol", on: "*", off: "8" },
						{ type: "symbol", on: "(", off: "9" },
						{ type: "symbol", on: ")", off: "0" },
						{ type: "symbol", on: "_", off: "-" },
						{ type: "symbol", on: "+", off: "=" },
						{ type: "delete", value: "del" }
					], [
						{ type: "tab", value: "tab" },
						{ type: "letter", value: "q" },
						{ type: "letter", value: "w" },
						{ type: "letter", value: "e" },
						{ type: "letter", value: "r" },
						{ type: "letter", value: "t" },
						{ type: "letter", value: "y" },
						{ type: "letter", value: "u" },
						{ type: "letter", value: "i" },
						{ type: "letter", value: "o" },
						{ type: "letter", value: "p" },
						{ type: "symbol", on: "{", off: "[" },
						{ type: "symbol", on: "}", off: "]" },
						{ type: "symbol", on: "|", off: "\\" }
					], [
						{ type: "capslock", value: "caps" },
						{ type: "letter", value: "a" },
						{ type: "letter", value: "s" },
						{ type: "letter", value: "d" },
						{ type: "letter", value: "f" },
						{ type: "letter", value: "g" },
						{ type: "letter", value: "h" },
						{ type: "letter", value: "j" },
						{ type: "letter", value: "k" },
						{ type: "letter", value: "l" },
						{ type: "symbol", on: ":", off: ";" },
						{ type: "symbol", on: "\"", off: "'" },
						{ type: "return", value: "enter" }
					], [
						{ type: "left-shift", value: "shift" },
						{ type: "letter", value: "z" },
						{ type: "letter", value: "x" },
						{ type: "letter", value: "c" },
						{ type: "letter", value: "v" },
						{ type: "letter", value: "b" },
						{ type: "letter", value: "n" },
						{ type: "letter", value: "m" },
						{ type: "symbol", on: "&lt;", off: "," },
						{ type: "symbol", on: "&gt;", off: "." },
						{ type: "symbol", on: "?", off: "/" },
						{ type: "right-shift", value: "shift" }
					], [
						{ type: "space", value: "space" }
					]
				]
			};

		var options = jQuery.extend( defaults, options );

		return this.each( function() {

				//Field to enter text into
				var $write = jQuery( this );
				var data = $write.data( 'keyboard' );

				if( !data ) {

					//Generate Keyboard
					var jsonLength = options['keyboardJSON'].length;
					var keyboard = [];

					for( var i = 0; i < jsonLength; i++ ) {

						var jsonILength = options['keyboardJSON'][i].length;
						var keyboardI = [];

						for( var j = 0; j < jsonILength; j++ ) {

							var keyObj = options['keyboardJSON'][i][j];

							if( keyObj['type'] == "visibility" && options['toggleButton'] === true ) {
								//Toggle visibility button; only shown when enabled in options

								keyboardI.push( '<div class="visibility ' + ( j == ( jsonILength - 1 ) ? ' lastitem' : '' ) + '"><span class="ui-icon ui-icon-circle-triangle-s"></span></div>' );
							} else if( keyObj['type'] == "symbol" ) {
								//Special case buttons, two display states

								keyboardI.push( '<div class="key symbol' + ( j == ( jsonILength - 1 ) ? ' lastitem' : '' ) + '"><span class="off">' + keyObj['off'] + '</span><span class="on">' + keyObj['on'] + '</span></div>' );
							} else if( keyObj['type'] != "visibility" ) {
								//Everything else (special case to not show toggle buttons)

								keyboardI.push( '<div class="key ' + keyObj['type'] + ( j == ( jsonILength - 1 ) ? ' lastitem' : '' ) + '">' + keyObj['value'] + '</div>' );
							}
						}

						keyboard.push( '<div class="' + options['rowClass'] + '">' + keyboardI.join( "" ) + '</div>' );
					}

					//Display HTML
					var $shell = jQuery( '<div class="' + options['containerClass'] + '">' + keyboard.join( "" ) + '<div class="clear"></div></div>' );
					$shell.insertAfter( $write );

					$write.data( 'keyboard', {
							keyboard: $shell,
							options: options
						});
				}

				//Hide alt symbols
				$shell.find( '.symbol span.on' ).hide();

				var shift = false;
				var capslock = false;

				//Build keyboard toggle button
				$shell.find( '.' + options['rowClass'] + ' div.visibility' )
					.button()
					.click( function() {

						$write.keyboard( 'toggle' );
					});

				//Apply UI & Bindings
				$shell.find( '.' + options['rowClass'] + ' div.key' )
					.button()
					.click( function() {

						var $this = jQuery( this );
						var character = $this.find( 'span' ).html();

						//shift keys
						if( $this.hasClass( 'left-shift' ) || $this.hasClass( 'right-shift' ) ) {

							$shell.find( '.letter' ).toggleClass( 'uppercase' );
							$shell.find( '.symbol span span' ).toggle();

							shift = ( shift === true ) ? false : true;

							capslock = false;

							return false;
						}

						//caps lock
						if( $this.hasClass( 'capslock' ) ) {

							$shell.find( '.letter' ).toggleClass( 'uppercase' );
							capslock = true;

							return false;
						}

						//uppercase, symbol, or special character
						character = $this.hasClass( 'symbol' ) ? $this.find( 'span span:visible' ).html() : character;
						character = $this.hasClass( 'space' ) ? " " : character;
						character = $this.hasClass( 'tab' ) ? "\t" : character;
						character = $this.hasClass( 'return' ) ? "\n" : character;
						character = $this.hasClass( 'uppercase' ) ? character.toUpperCase() : character.toLowerCase();

						//shift key handler
						if( shift === true ) {

							$shell.find( '.symbol span span' ).toggle();

							if( capslock === false ) {

								$shell.find( '.letter' ).toggleClass( 'uppercase' );
							}

							shift = false;
						}

						//delete
						if( $this.hasClass( 'delete' ) ) {

							if( $write.is( "input" ) ) {

								var val = $write.val();

								$write.val( val.substr( 0, val.length - 1 ) );
								return false;
							} else {

								var html = $write.html();

								$write.html( html.substr( 0, html.length - 1 ) );
								return false;
							}
						}

						//append character to text
						{

							if( $write.is( "input" ) ) {

								$write.val( $write.val() + character );
							} else {

								$write.html( $write.html() + character );
							}
						}
					});
			});
	},
	show: function() {

		return this.each( function() {

				var data = jQuery( this ).data( 'keyboard' );

				data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.key' ).show( 'blind', {}, 'slow' );
				data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.visibility .ui-icon' ).addClass( 'ui-icon-circle-triangle-s' );
				data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.visibility .ui-icon' ).removeClass( 'ui-icon-circle-triangle-e' );
			});
	},
	hide: function() {

		return this.each( function() {

				var data = jQuery( this ).data( 'keyboard' );

				data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.key' ).hide( 'blind', {}, 'slow' );
				data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.visibility .ui-icon' ).addClass( 'ui-icon-circle-triangle-e' );
				data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.visibility .ui-icon' ).removeClass( 'ui-icon-circle-triangle-s' );
			});
	},
	toggle: function() {

		return this.each( function() {

				var data = jQuery( this ).data( 'keyboard' );
				var vis = data['keyboard'].find( '.' + data['options']['rowClass'] + ' div.visibility .ui-icon' );

				jQuery( this ).keyboard( vis.hasClass( 'ui-icon-circle-triangle-e' ) ? "show" : "hide" );
			});
	}
};

jQuery.fn.keyboard = function( method ) {

	// Method calling logic
	if( methods[method] ) {

		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if( typeof method === 'object' || ! method ) {

		return methods.init.apply( this, arguments );
	} else {

		jQuery.error( 'Method ' +  method + ' does not exist on jQuery.keyboard' );
	}
};