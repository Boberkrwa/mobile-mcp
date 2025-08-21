export class MaccabiSelectors {
	// Common elements
	static readonly Next_Button = "id=com.ideomobile.maccabipregnancy:id/nextButton";
	static readonly Previous_Button = "id=com.ideomobile.maccabipregnancy:id/previousButton";
	static readonly Title = "id=com.ideomobile.maccabipregnancy:id/title";

	// Splash screen elements
	static readonly Skip_Button_Text = "דלגי";
	static readonly Text_View = `//*[contains(@class, "android.widget.TextView")]`;

	// Name input screen
	static readonly Name_Input = "id=com.ideomobile.maccabipregnancy:id/nameTextInputEditText";

	// Date input screen
	static readonly Date_Input = "id=com.ideomobile.maccabipregnancy:id/textInputEditText";
	static readonly Date_Picker_Elements = `//*[contains(@resource-id, "date") or contains(@resource-id, "picker") or contains(@resource-id, "calendar")]`;
	static readonly Clickable_Elements = `//*[@clickable="true"]`;
	static readonly Confirm_Buttons = `//*[contains(@text, "OK") or contains(@text, "Done") or contains(@text, "אישור") or contains(@text, "סיום")]`;

	// Fetus count screen
	static readonly Fetus_Count_Options = `//*[contains(@class, "android.widget.TextView") and (@text="1" or @text="2" or @text="3")]`;
	static readonly Fetus_Title_Text = "עוברים";

	// Terms and conditions
	static readonly Terms_Text = "id=com.ideomobile.maccabipregnancy:id/termsOfUseText";

	// Dashboard elements
	static readonly Weeks_Counter = "id=com.ideomobile.maccabipregnancy:id/weeksAndDaysCounterTextView";
	static readonly Week_Info_Button = "id=com.ideomobile.maccabipregnancy:id/weekInfoButton";
	static readonly All_Tests_Text = "id=com.ideomobile.maccabipregnancy:id/allTestsTextView";
	static readonly Test_Name_Text = "id=com.ideomobile.maccabipregnancy:id/testNameTextView";

	// Generic element patterns
	static readonly All_Interactive_Elements = `//*[contains(@class, "android.widget.EditText") or contains(@class, "android.widget.Button") or contains(@class, "android.widget.TextView")]`;

	// Swipe actions
	static readonly SwipeUpAction = {
		type: "pointer" as const,
		id: "finger1",
		parameters: { pointerType: "touch" as const },
		actions: [
			{ type: "pointerMove" as const, duration: 0, x: 479, y: 1686, origin: "viewport" as const },
			{ type: "pointerDown" as const, button: 0 },
			{ type: "pointerMove" as const, duration: 1000, x: 488, y: 668, origin: "viewport" as const },
			{ type: "pointerUp" as const, button: 0 }
		]
	};
}
