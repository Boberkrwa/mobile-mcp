using OpenQA.Selenium;
using OpenQA.Selenium.Appium;

namespace PregnancyApp.Helpers
{
    public static class HomePageLocators
    {
        public static readonly By PersonalAreaButton = By.Id("com.ideomobile.maccabipregnancy:id/topPanel");
        public static readonly By PersonalMedicalFileButton = MobileBy.AndroidUIAutomator("new UiSelector().descriptionContains(\"התיק הרפואי\").descriptionContains(\"שלך\")");
        public static readonly By IdInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditText");
        public static readonly By PasswordInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditTextPassword");
        public static readonly By LoginButton = By.Id("com.ideomobile.maccabipregnancy:id/enterButton");
        public static readonly By YourBagButton = By.XPath("(//android.widget.ImageView[@resource-id=\"com.ideomobile.maccabipregnancy:id/ivCubeImage\"])[1]");
        public static readonly By YOurBagFirstIndex = By.XPath("//androidx.recyclerview.widget.RecyclerView[@resource-id=\"com.ideomobile.maccabipregnancy:id/rvMyListTab\"]/android.widget.LinearLayout[1]");
        public static readonly By YourList = By.Id("com.ideomobile.maccabipregnancy:id/btnMyList");
        public static readonly By FetusMovementButton = By.XPath("//android.widget.LinearLayout[@content-desc=\"לחצן מעקב תנועות עובר\"]/android.widget.FrameLayout/android.widget.ImageView[1]");
        public static readonly By StartFetusMovement = By.XPath("//android.widget.FrameLayout[@content-desc=\"לחצן התחילי מעקב\"]/android.widget.FrameLayout/android.widget.ImageView");

        public static readonly By FinishTrackingButton = By.Id("com.ideomobile.maccabipregnancy:id/successFinishButton");
    }
}
