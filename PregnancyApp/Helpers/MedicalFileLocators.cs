using OpenQA.Selenium;

namespace PregnancyApp.Helpers
{
    public static class MedicalFileLocators
    {
        public static readonly By LabResults = By.Id("com.ideomobile.maccabipregnancy:id/labResultsButton");

        public static readonly By FirstLabResult = By.XPath("(//android.view.ViewGroup[@resource-id=\"com.ideomobile.maccabipregnancy:id/itemBackground\"])[1]");

        public static readonly By UniqueLabTest = By.XPath("//android.widget.TextView[@resource-id='com.ideomobile.maccabipregnancy:id/tvItemTestName' and @text='Blood Group / Rh']");

        public static readonly By UltraSoundTests = By.Id("com.ideomobile.maccabipregnancy:id/ultrasoundButton");

        public static readonly By UrineTestButton = By.Id("com.ideomobile.maccabipregnancy:id/urineTestButton");
    }

}