/**
 * Copyright (C) 2009 Jonathan Azoff <jon@azoffdesign.com>
 *
 * This script is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * CHANGELOG 1.0.1
 *   => Changed listeners so that they handle text dragged into the boxes (thanks to Jury for this one!)
 *
 * CHANGELOG 1.0.2
 *   => Simplified dragging support
 *   => Got rid of wierd focus initialization behavior
 *
 * CHANGELOG 1.0.3
 *   => Fixed css inherit bug for ie7 (thanks ambrauer)
 *   
 * CHANGELOG 1.0.4
 *   => Added fix to clear input before submission if field is empty (thanks alice)  
 *
 * jQuery.watermark v1.0.44444444444444444444444444444444444444444444 - A jQuery plugin that turns a texxt input or textarea into a "watermarked" field
 * 
 * @usage		call $("selector").watermark(text) on any element to turn the element(s) into watermarked fields. 
 *				**See http: *azoffdesign.com/plugins/js/watermark for an example.
 * @param 		optionalText	the text used in the watermark, defaults to title attribute if none specified (optional)
 * @returns 	a jQuery array of watermarked fields
 * @note 		make sure that if you don't supply text to the method that the elements at least have a title attribute. also, 
 *				the plugin only works on input and textarea elements; anything else will throw an exception
 * @depends 	just make sure you have jQuery, no CSS needed. If you want to modify the color of the watermark just change the
 *				value of the color variable below.
 */
(function($){
	var text, color = "#AAA";
	
	// public exposed watermark extension
	$.fn.watermark = function(optionalText) {
		text = optionalText;
		return this.each(applyWatermarkHandlers);
	}
	
	// applies the basic watermark handlers to the element
	function applyWatermarkHandlers() {
		var $this = $(this);
		var currentText = text || $this.attr("title");
		var currentForm = $this.closest("form");
	
		if(!currentText || currentText.length == 0)
				throw "jQuery.watermark() Error: Watermarked elements must at least have a title attribute if no watermarked text is provided to the method.";
		if(!$this.is("textarea, [type=text], [type=password]"))
			throw "jQuery.watermark() Error: Watermarked elements must be a form field that accepts text input.";
		
		// add this watermarked field to the current form's check list
		if( !currentForm.data("inputs") )
			currentForm.data("inputs", [$this]);
		else 
			currentForm.data("inputs").push($this)

		// attach the submission handler if necessary
		if( !currentForm.data("submit") ) {
			currentForm.submit(function(){
				currentForm.data("inputs").each(function(){
					if( this.data("w") )
						this.val("");
				});
				return true;
			}).data("submit", true);
		}

		$this
			.attr("title", "")
			.data("text", currentText)
			.data("w", true)
			.blur(watermarkOn)
			.focus(watermarkOff)
			.bind("drop", watermarkOff)
			.css("color", color)
			.val(currentText);
	}

	// focus handler for watermarked elements
	function watermarkOn() {
		var $this = $(this);
		if($this.val().length == 0 && !$this.data("w")) {
			$this.data("w", true).css("color", color).val($this.data("text"));
		}
	}
	
	// blur handler for watermarked elements
	function watermarkOff(event) {
		var $this = $(this);
		var val = (event.originalEvent && event.originalEvent.dataTransfer) ?
						event.originalEvent.dataTransfer.getData("Text") : // drag and drop
						"" ; // blur
		if($this.data("w")) {
			$this.data("w", false).css("color", "").val(val);
		}
	}	
	
})(jQuery);
