/**
 * jQuery toggle button plugin
 * Converts a input[type=checkbox] & associated label to a button with different messages for on and off
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
				onText: "On",
				offText: "Off",
				onClass: "",
				offClass: ""
			};

		var options = jQuery.extend( defaults, options );

		return this.each( function() {

				var $self = jQuery( this );
				var $label = jQuery( 'label[for=' + $self.attr( 'id' ) + ']' );

				if( !$self.is( "input[type=checkbox]" ) ) {
					//Validate type of element

					jQuery.error( "Invalid element type. toggleButton must be used on an input[type=checkbox]" );
					return;
				}

				if( $label.length <= 0 ) {
					//Create label element if not exist

					jQuery( '<label for="' + $self.attr( 'id' ) + '"> </label>' ).insertBefore( $self );
					$label = jQuery( 'label[for=' + $self.attr( 'id' ) + ']' );
				}

				//Field to enter text into
				var data = $self.data( 'toggleButton' );

				if( !data ) {

					//Generate toggleButton
					$self.button();

					$self.data( 'toggleButton', {
							self: $self,
							label: $label,
							options: options
						});
				}

				//Apply Bindings
				$self.click( function() {

						jQuery( this ).toggleButton( "update" );
					});

				//Style
				$self.toggleButton( "update" );
			});
	},
	update: function() {

		return this.each( function() {

				var data = jQuery( this ).data( 'toggleButton' );

				data['label'].removeClass( "ui-state-default ui-state-hover ui-state-focus ui-state-active ui-state-highlight ui-state-error ui-state-disabled" );

				if( data['self'].is( ":checked" ) ) {

					data['self'].button( "option", "label", data['options']['onText'] );

					data['label'].addClass( data['options']['onClass'] );
					data['label'].removeClass( data['options']['offClass'] );
				} else {

					data['self'].button( "option", "label", data['options']['offText'] );

					data['label'].removeClass( data['options']['onClass'] );
					data['label'].addClass( data['options']['offClass'] );
				}
			});
	}
};

jQuery.fn.toggleButton = function( method ) {

	// Method calling logic
	if( methods[method] ) {

		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if( typeof method === 'object' || ! method ) {

		return methods.init.apply( this, arguments );
	} else {

		jQuery.error( 'Method ' +  method + ' does not exist on jQuery.toggleButton' );
	}
};