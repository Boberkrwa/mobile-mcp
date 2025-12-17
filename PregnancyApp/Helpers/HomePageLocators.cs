using OpenQA.Selenium;
using OpenQA.Selenium.Appium;

namespace PregnancyApp.Helpers
{
    public static class HomePageLocators
    {
        public static readonly By PersonalAreaButton = MobileBy.AndroidUIAutomator("new UiSelector().textContains(\"איזור אישי\")");
        public static readonly By PersonalMedicalFileButton = MobileBy.AndroidUIAutomator("new UiSelector().descriptionContains(\"התיק הרפואי\").descriptionContains(\"שלך\")");
        public static readonly By IdInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditText");
        public static readonly By PasswordInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditTextPassword");
        public static readonly By LoginButton = By.Id("com.ideomobile.maccabipregnancy:id/enterButton");
    }
}
