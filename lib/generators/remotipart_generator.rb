require 'rails/generators'

class RemotipartGenerator < Rails::Generators::Base
  def self.source_root
    File.join(File.dirname(__FILE__), 'templates')
  end
  
  def install_remotipart
    copy_file(
      'jquery.remotipart.js',
      'public/javascripts/jquery.remotipart.js'
    )
  end
end