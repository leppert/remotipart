(function ($) {
    function fire(obj, name, data) {
	  	var event = new $.Event(name);
	  	obj.trigger(event, data);
	  	return event.result !== false;
	  }
    $.fn.extend({
		/**
	     * Handles execution of remote calls involving file uploads, firing overridable events along the way
	     */
	    callRemotipart: function () {
	        var el      = this,
	            url     = el.attr('action'),
              dataType = el.attr('data-type') || 'script';

	        if (url === undefined) {
	          throw "No URL specified for remote call (action must be present).";
	        } else {
              // Since iframe-submitted form is submitted normal-style and cannot set custom headers,
              // we'll add a custom hidden input to keep track and let the server know this was still
              // an AJAX form, we'll also make it easy to tell from our jQuery element object.
              el
                .append($('<input />', {
                  type: "hidden",
                  name: "remotipart_submitted",
                  value: true
                }))
                .data('remotipartSubmitted', dataType);

              if (dataType == 'script') {
		          	url = url.split('?'); // split on GET params
					      if(url[0].substr(-3) != '.js') url[0] += '.js'; // force rails to respond to respond to the request with :format = js
					      url = url.join('?'); // join on GET params
              }
					
	                el.ajaxSubmit({
	                    url: url,
	                    dataType: dataType,
	                    beforeSend: function (xhr, settings) {
                        if (settings.dataType === undefined) {
                          xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
                        }
                        var proceed = fire(el, 'ajax:beforeSend', [xhr, settings, true]);
                        if (proceed) { el.trigger('ajax:loading', [xhr]); }
                        return proceed;
                      },
	                    success: function (data, status, xhr) {
	                        el.trigger('ajax:success', [data, status, xhr]);
	                    },
	                    complete: function (xhr) {
	                        el.trigger('ajax:complete', xhr);
	                    },
	                    error: function (xhr, status, error) {
	                        el.trigger('ajax:failure ajax:error', [xhr, status, error]);
	                    }
	                });
	            }

	            el.trigger('ajax:after');
		}
	});

  $('form[data-remote]').live('ajax:beforeSend', function (evt, xhr, settings, remotipart) {

    if (!remotipart && $(this).find('input:file').length) {
      $(this).callRemotipart();
      return false;
    }
    
    return true;
  });
})(jQuery);
