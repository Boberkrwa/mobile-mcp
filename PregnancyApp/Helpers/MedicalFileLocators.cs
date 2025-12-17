using OpenQA.Selenium;
using OpenQA.Selenium.Appium;

namespace PregnancyApp.Helpers
{
    public static class MedicalFileLocators
    {
        public static readonly By LabResults = MobileBy.XPath("//android.widget.Button[@resource-id=\"com.ideomobile.maccabipregnancy:id/labResultsButton\"]");

        public static readonly By FirstLabResult = MobileBy.XPath("//android.widget.TextView[@resource-id=\"com.ideomobile.maccabipregnancy:id/nameOfTestTextView\"]");

        public static readonly By UniqueLabTest = MobileBy.XPath("//android.widget.TextView[@resource-id='com.ideomobile.maccabipregnancy:id/tvItemTestName' and @text='Blood Group / Rh']");
    }

}