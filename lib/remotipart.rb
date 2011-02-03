module Remotipart
  def remotipart_response(options = {}, &block)
    return yield unless params[:remotipart_submitted]
    response.content_type = Mime::HTML
    content = with_output_buffer(&block)
    text_area_tag('remotipart_response', String.new(content), options)
  end
end

class ActionView::Base
  include Remotipart
end
