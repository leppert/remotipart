(function ($) {
  // Triggers an event on an element and returns the event result
  function fire(obj, name, data) {
    var event = new $.Event(name);
    obj.trigger(event, data);
    return event.result !== false;
  }

  // Submits "remote" forms and links with ajax
  function handleRemote(element) {
    var method, url, data,
    dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType) || 'script';

    // Since iframe-submitted form is submitted normal-style and cannot set custom headers,
    // we'll add a custom hidden input to keep track and let the server know this was still
    // an AJAX form.
    element.append($('<input />', {
      type: "hidden",
      name: "remotipart_submitted",
      value: true
      }))
      .data('remotipartSubmitted', dataType);

    if (fire(element, 'ajax:before')) {
      method = element.attr('method');
      url = element.attr('action');
      data = element.serializeArray();
      // memoized value from clicked submit button
      var button = element.data('ujs:submit-button');
      if (button) {
        data.push(button);
        element.data('ujs:submit-button', null);
      }


      if (dataType == 'script') {
        url = url.split('?'); // split on GET params
        if(url[0].substr(-3) != '.js') url[0] += '.js'; // force rails to respond to respond to the request with :format = js
        url = url.join('?'); // join on GET params
      }
      element.ajaxSubmit({
        url: url, type: method || 'GET', data: data, dataType: dataType,
        // stopping the "ajax:beforeSend" event will cancel the ajax request
        beforeSend: function(xhr, settings) {
          return fire(element, 'ajax:beforeSend', [xhr, settings]);
        },
        success: function(data, status, xhr) {
          element.trigger('ajax:success', [data, status, xhr]);
        },
        complete: function(xhr, status) {
          element.trigger('ajax:complete', [xhr, status]);
        },
        error: function(xhr, status, error) {
          element.trigger('ajax:error', [xhr, status, error]);
        }
      });
    }
  }

  function disableFormElements(form) {
    form.find('input[data-disable-with]').each(function() {
      var input = $(this);
      input.data('ujs:enable-with', input.val())
      .val(input.attr('data-disable-with'))
      .attr('disabled', 'disabled');
    });
  }

  $('form').live('ajax:aborted:file.remotipart', function(){
    var form = $(this), remote = form.attr('data-remote') != undefined;

    if (remote) {
      handleRemote(form);
      return false;
    } else {
      disableFormElements(form);
    }
  });

})(jQuery);
