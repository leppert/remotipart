module Remotipart
  def remotipart_response(&block)
    response.content_type = Mime::HTML
    content = with_output_buffer(&block)
    text_area_tag('remotipart_response', String.new(content))
  end
end

class ActionView::Base
  include Remotipart
end