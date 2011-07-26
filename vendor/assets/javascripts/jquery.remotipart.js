//= require jquery.iframe-transport.js
//= require_self

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

        // Allow setup part of $.rails.handleRemote to setup remote settings before canceling default remote handler
        // This is required in order to change the remote settings using the form details
        .bind('ajax:beforeSend.remotipart', function(e, xhr, settings){

          //Prevent this from running again to avoid infinite looping
          $(this).unbind('ajax:beforeSend.remotipart')

          // Delete the beforeSend bindings, since we're about to re-submit via ajaxSubmit with the beforeSubmit
          // hook that was just setup and triggered via the default `$.rails.handleRemote`
          // delete settings.beforeSend;
          settings.iframe      = true;
          settings.files       = $($.rails.fileInputSelector, form);
          settings.data        = $(this).serializeArray();
          settings.processData = false;

          // Second verse, same as the first
          $.rails.ajax(settings);

          //Run cleanup
          $(this).children("#remotipart_submitted").remove();
          $(this).removeData('remotipartSubmitted');

          // Cancel the jQuery UJS request
          return false;
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
    if (!$.support.submitBubbles && $.rails.callFormSubmitBindings(form) === false) return $.rails.stopEverything(e);

    // Manually call jquery-ujs remote call so that it can setup form and settings as usual,
    // and trigger the `ajax:beforeSend` callback to which remotipart binds functionality.
    $.rails.handleRemote(form);
    return false;
  });

})(jQuery);