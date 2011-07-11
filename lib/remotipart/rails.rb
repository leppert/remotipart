module Remotipart
  module Rails
    require 'remotipart/rails/railtie' if ::Rails.version < "3.1"
  end
end
