jQuery Toggle Button Plugin
===========================

*author* Matthew Schott <ryltar@ku.edu>

Plugin converts an input[type=checkbox] and associated label (if exists) to a toggable button. Button has settable messages & classes for checked and unchecked state.

**Requires** jQuery (tested with 1.6.2), jQueryUI (tested with 1.8.16)

Usage
-----
$( '#myCheckboxElem' ).toggleButton( {
				"onText": "Enabled",
				"onClass": "",
				"offText": "Disabled",
				"offClass": "ui-state-error"
			});

All settings are optional. Default labels are 'On' and 'Off'. Default classes are ui-state-default for 'off' and ui-state-active for 'on'.

Licensed under the GPL license: http://www.gnu.org/licenses/gpl.html
