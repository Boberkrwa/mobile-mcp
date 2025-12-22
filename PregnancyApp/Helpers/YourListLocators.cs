using OpenQA.Selenium;
using OpenQA.Selenium.Appium;

namespace PregnancyApp.Helpers
{
    public static class YourListLocators
    {
        public static readonly By YourListOptionsButton = By.Id("com.ideomobile.maccabipregnancy:id/moreImageButton");

        public static readonly By YourListDeleteButton = By.XPath("(//android.widget.LinearLayout[@resource-id='android:id/content'])[2]");

        public static readonly By DeleteItemCheckbox = By.Id("com.ideomobile.maccabipregnancy:id/cbMyLists");

        public static readonly By ConfirmDeleteButton = By.Id("com.ideomobile.maccabipregnancy:id/addItemPanel");
    }
}
