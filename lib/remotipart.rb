module Remotipart
  def remotipart_return(&block)
    response.content_type = Mime::HTML
    content = with_output_buffer(&block)
    text_area_tag 'remotipart_return', content
  end
end

class ActionView::Base
  include Remotipart
end