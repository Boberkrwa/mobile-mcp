export class MaccabiSelectors {
	// Common elements
	static readonly NEXT_BUTTON = "id=com.ideomobile.maccabipregnancy:id/nextButton";
	static readonly PREVIOUS_BUTTON = "id=com.ideomobile.maccabipregnancy:id/previousButton";
	static readonly TITLE = "id=com.ideomobile.maccabipregnancy:id/title";

	// Splash screen elements
	static readonly SKIP_BUTTON_TEXT = "דלגי";
	static readonly TEXT_VIEW = `//*[contains(@class, "android.widget.TextView")]`;

	// Name input screen
	static readonly NAME_INPUT = "id=com.ideomobile.maccabipregnancy:id/nameTextInputEditText";

	// Date input screen
	static readonly DATE_INPUT = "id=com.ideomobile.maccabipregnancy:id/textInputEditText";
	static readonly DATE_PICKER_ELEMENTS = `//*[contains(@resource-id, "date") or contains(@resource-id, "picker") or contains(@resource-id, "calendar")]`;
	static readonly CLICKABLE_ELEMENTS = `//*[@clickable="true"]`;
	static readonly CONFIRM_BUTTONS = `//*[contains(@text, "OK") or contains(@text, "Done") or contains(@text, "אישור") or contains(@text, "סיום")]`;

	// Fetus count screen
	static readonly FETUS_COUNT_OPTIONS = `//*[contains(@class, "android.widget.TextView") and (@text="1" or @text="2" or @text="3")]`;
	static readonly FETUS_TITLE_TEXT = "עוברים";

	// Terms and conditions
	static readonly TERMS_TEXT = "id=com.ideomobile.maccabipregnancy:id/termsOfUseText";

	// Dashboard elements
	static readonly WEEKS_COUNTER = "id=com.ideomobile.maccabipregnancy:id/weeksAndDaysCounterTextView";
	static readonly WEEK_INFO_BUTTON = "id=com.ideomobile.maccabipregnancy:id/weekInfoButton";
	static readonly ALL_TESTS_TEXT = "id=com.ideomobile.maccabipregnancy:id/allTestsTextView";
	static readonly TEST_NAME_TEXT = "id=com.ideomobile.maccabipregnancy:id/testNameTextView";

	// Generic element patterns
	static readonly ALL_INTERACTIVE_ELEMENTS = `//*[contains(@class, "android.widget.EditText") or contains(@class, "android.widget.Button") or contains(@class, "android.widget.TextView")]`;
}
