Given(/^the Client is signed in$/) do
  visit('http://127.0.0.1:4000')
  click_link('sign-in for demo')
  page.driver.browser.switch_to.alert.accept
end

Given(/^the Client presses the "(.*?)" button in "(.*?)"$/) do |arg1, arg2|
  pending # express the regexp above with the code you wish you had
end

Given(/^the Client has at least "(.*?)" item in the "(.*?)"$/) do |arg1, arg2|
  pending # express the regexp above with the code you wish you had
end

Given(/^the Client has no saved address$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^a "(.*?)" screen will be shown$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^"(.*?)" is "(.*?)"$/) do |arg1, arg2|
  pending # express the regexp above with the code you wish you had
end

Given(/^the Client taps on an input field$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^the page should scroll bringing the input field above the soft keyboard$/) do
  pending # express the regexp above with the code you wish you had
end

Given(/^the Client taps on the "(.*?)" field$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^the "(.*?)" soft keyboard is shown$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Given(/^the Client typing into an input field$/) do
  pending # express the regexp above with the code you wish you had
end

Given(/^there are more than "(.*?)" input field\(s\)$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

When(/^the Client taps "(.*?)" on the soft keyboard$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^the previous input field should receive focus$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^the next input field should receive focus$/) do
  pending # express the regexp above with the code you wish you had
end

Given(/^some "(.*?)" fields are left empty$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Given(/^Client presses either "(.*?)" button$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^"(.*?)" fields will have an "(.*?)" icon$/) do |arg1, arg2|
  pending # express the regexp above with the code you wish you had
end

Given(/^all "(.*?)" fields are populated$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Given(/^all inputs are validated$/) do
  pending # express the regexp above with the code you wish you had
end

When(/^Client presses either "(.*?)" button$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^the address should save$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^Client should be taken to the "(.*?)" screen$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end
