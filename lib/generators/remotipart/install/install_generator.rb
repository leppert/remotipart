require 'rails'

module Remotipart
  module Generators
    class InstallGenerator < ::Rails::Generators::Base

      desc "This generator installs Form.js #{Remotipart::Rails::FORMJS_VERSION} and Remotipart #{Remotipart::Rails::VERSION}"
      source_root File.expand_path('../../../../../vendor/assets/javascripts', __FILE__)

      def install_formjs
        say_status "copying", "Form.js #{Remotipart::Rails::FORMJS_VERSION}", :green
        copy_file "jquery.form.js", "public/javascripts/jquery.form.js"
      end

      def install_remotipart
        say_status "copying", "Remotipart.js #{Remotipart::Rails::VERSION}", :green
        copy_file 'jquery.remotipart.js', 'public/javascripts/jquery.remotipart.js'
      end
    end
  end
end
