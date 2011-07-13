module Remotipart

  #Responder used to automagically wrap any non-xml replies in a text-area
  # as expected by iframe-transport
  module Responder
    def to_format
      debugger
      content = super
      if remotipart_requested?
        content = "<textarea data-type=\"#{response.content_type}\">#{content}</textarea>"
        response.content_type = Mime::HTML
      end
      content
    end
  end
end
