(function($) {

  var remotipart;

  $.remotipart = remotipart = {

    setup: function(form) {
      form
        // Append hidden input so we can tell from back-end when form has been submitted by remotipart
        .append($('<input />', {
          'id': "remotipart_submitted",
          type: "hidden",
          name: "remotipart_submitted",
          value: true
        }))

        // Allow setup part of $.rails.handleRemot to setup remote settings before canceling default remote handler
        .bind('ajax:beforeSend.remotipart', function(e, xhr, origSettings){
          // Shallow copy
          var settings = $.extend({}, origSettings);

          // Delete the beforeSend bindings, since we're about to re-submit via ajaxSubmit with the beforeSubmit
          // hook that was just setup and triggered via the default `$.rails.handleRemote`
          delete settings.beforeSend;
          // form.js's `ajaxSubmit` will re-create this for us
          delete settings.data;

          // Manually set the default dataType if not defined, since the form.js's `ajaxSubmit` function
          // does not actually submit an xhr request (which has its default dataType set by rails.js)
          if (settings.dataType === undefined) settings.dataType = 'script';

          // Allow remotipartSubmit to be cancelled if needed
          if ($.rails.fire(form, 'ajax:remotipartSubmit', [xhr, settings])) {

            // Setup request URL for js dataType (needed for some versions of IE)
            if (settings.dataType == 'script') {
		          settings.url = settings.url.split('?'); // split on GET params
		          if (settings.url[0].substr(-3) != '.js') settings.url[0] += '.js'; // force rails to respond to respond to the request with :format = js
		          settings.url = settings.url.join('?'); // join on GET params
            }

            // Update remotipartSubmitted data with dataType, in case needed in other scripts
            form.data('remotipartSubmitted', settings.dataType);
            // And finally, Use form.js's `ajaxSubmit` to do remote file uploading via iframe method
            form.ajaxSubmit(settings);

            // Cancel the default jquery-ujs remote call by returning false for `ajax:beforeSend`
            return false;
          }
        })

        // Keep track that we just set this particular form with Remotipart bindings
        // Note: The `true` value will get over-written with the `settings.dataType` from the `ajax:beforeSend` handler
        .data('remotipartSubmitted', true);
    },

    teardown: function(form) {
      form
        .unbind('ajax:beforeSend.remotipart')
        .children('#remotipart_submitted').remove();
      delete form.data.remotipartSubmitted;
    }
  };

  $('form').live('ajax:aborted:file', function(){
    var form = $(this);

    // Only need to setup form and make form bindings once.
    // If form has already been setup, just let bindings be executed.
    if (form.data('remotipartSubmitted') === undefined) remotipart.setup(form);

    // If browser does not support submit bubbling, then this live-binding will be called before direct
    // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
    if (!$.support.submitBubbles && 'callFormSubmitBindings' in $.rails && $.rails.callFormSubmitBindings(form) === false) return $.rails.stopEverything(e);

    // Manually call jquery-ujs remote call so that it can setup form and settings as usual,
    // and trigger the `ajax:beforeSend` callback to which remotipart binds functionality.
    $.rails.handleRemote(form);

    // Return false to prevent standard browser behavior (part of jquery-ujs api for `ajax:aborted:file`)
    return false;
  });

})(jQuery);
