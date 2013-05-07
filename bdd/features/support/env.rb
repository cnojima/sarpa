require 'capybara/rspec'
require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'capybara/webkit'
require 'selenium-webdriver'
require 'yaml'
require 'pry'

#from sauce docs
#workaround sauce not finding capybara abstraction methods
#http://stackoverflow.com/questions/9059854/capybara-undefined-method-visit
include Capybara::DSL	

#temp patch from sauce tech support until 2.4.2 is released
module Sauce 
	class Selenium2 
		def current_url 
			@driver.current_url 
		end 
	end
end

class SaucySarpa
	Capybara.run_server = false					# recommended by documentation when testing non-rack apps
	Capybara.default_wait_time = 2
	Capybara.server_port = 9887 + ENV['TEST_ENV_NUMBER'].to_i

	if ENV['local'] == nil || ENV['local'] == 'false'
		require 'sauce/capybara'
		require 'sauce/cucumber'

		Sauce.config do |c|
		  c[:browsers] = [
			# ["OS X 10.6","firefox","20"],
			["Windows 7", "chrome", ""],
		  	["Windows 7", "Internet Explorer", "8"],
		  	["Windows 7", "firefox", "20"],
		  	["windows","firefox","18"]
		  ]

		  c[:build] = '0.0.1'
		end
		Capybara.default_driver = :sauce
	else
		Capybara.default_driver = :selenium
		# Capybara.default_driver = :poltergeist
		# Capybara.default_driver = :mechanize
		# Capybara.javascript_driver = :poltergeist
		# Capybara.javascript_driver = :selenium
	end
end

World do 
	SaucySarpa.new
end
