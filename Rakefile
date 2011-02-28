require 'rubygems'
require 'rake'

begin
  require 'jeweler'
  Jeweler::Tasks.new do |gem|
    gem.name = "remotipart"
    gem.summary = %Q{Remotipart is a Ruby on Rails gem enabling remote multipart forms (AJAX style file uploads) with jQuery.}
    gem.description = %Q{Remotipart is a Ruby on Rails gem enabling remote multipart forms (AJAX style file uploads) with jQuery.
    This gem augments the native Rails jQuery remote form function enabling asynchronous file uploads with little to no modification to your application.
    It requires jQuery (http://jquery.com), the Rails jQuery driver (http://github.com/rails/jquery-ujs), and the jQuery Form plugin (http://jquery.malsup.com/form/).
    }
    gem.email = %w{greg@formasfunction.com steve@alfajango.com}
    gem.homepage = "http://github.com/formasfunction/remotipart"
    gem.authors = ["Greg Leppert", "Steve Schwartz"]
    gem.add_development_dependency "thoughtbot-shoulda", ">= 0"
    # gem is a Gem::Specification... see http://www.rubygems.org/read/chapter/20 for additional settings
  end
  Jeweler::GemcutterTasks.new
rescue LoadError
  puts "Jeweler (or a dependency) not available. Install it with: gem install jeweler"
end

require 'rake/testtask'
Rake::TestTask.new(:test) do |test|
  test.libs << 'lib' << 'test'
  test.pattern = 'test/**/test_*.rb'
  test.verbose = true
end

begin
  require 'rcov/rcovtask'
  Rcov::RcovTask.new do |test|
    test.libs << 'test'
    test.pattern = 'test/**/test_*.rb'
    test.verbose = true
  end
rescue LoadError
  task :rcov do
    abort "RCov is not available. In order to run rcov, you must: sudo gem install spicycode-rcov"
  end
end

task :test => :check_dependencies

task :default => :test

require 'rake/rdoctask'
Rake::RDocTask.new do |rdoc|
  version = File.exist?('VERSION') ? File.read('VERSION') : ""

  rdoc.rdoc_dir = 'rdoc'
  rdoc.title = "remotipart #{version}"
  rdoc.rdoc_files.include('README*')
  rdoc.rdoc_files.include('lib/**/*.rb')
end
