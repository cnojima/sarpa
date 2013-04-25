Feature: Add/Edit/Delete Address
	As a signed in user who is going through Checkout, the Client is able to add a new shipping address, edit/select an existing address from their address book, and make any of these addressed their default shipping address. 

	Background:
		Given the Client is signed in
		And the Client presses the "Checkout" button in "Basket"
		And the Client has at least "1" item in the "Basket"

	Scenario: Client has no saved addresses and will see the "Add Address" screen
		Given the Client has no saved address
		Then a "New Address" screen will be shown
		And "Set as my default shipping address" is "checked"

	Scenario: Tapping on an input should center input in view above soft keyboard
		Given the Client taps on an input field
		Then the page should scroll bringing the input field above the soft keyboard

	Scenario: Tapping on the "Zip Code" field brings up the "number entry" soft keyboard
		Given the Client taps on the "Zip Code" field
		Then the "number entry" soft keyboard is shown

	Scenario: Soft keyboard "Previous" & "Next" buttons should function as "shift-tab" and "tab"
		Given the Client typing into an input field
		And there are more than "1" input field(s)
		When the Client taps "Previous" on the soft keyboard
		Then the previous input field should receive focus
		When the Client taps "Next" on the soft keyboard
		Then the next input field should receive focus

	Scenario: Testing form validation - required fields
		Given some "required" fields are left empty
		And Client presses either "Done" button
		Then "required" fields will have an "error" icon

	Scenario: Tapping the "Done" button saves the address
		Given all "required" fields are populated
		And all inputs are validated
		When Client presses either "Done" button
		Then the address should save
			And Client should be taken to the "Checkout Summary" screen

