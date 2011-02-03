module Remotipart
  def remotipart_response(options = {}, &block)
    content = with_output_buffer(&block)
    if params[:remotipart_submitted]
      response.content_type = Mime::HTML
      text_area_tag('remotipart_response', String.new(content), options)
    else
      content
    end
  end
end

class ActionView::Base
  include Remotipart
end
