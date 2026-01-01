using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests.Pages
{
    public class MedicalFile
    {
        private readonly AndroidDriver _driver;

        public MedicalFile(AndroidDriver driver)
        {
            _driver = driver;
        }

        public void TapLabTests()
        {
            var element = new WebDriverWait(_driver, TimeSpan.FromSeconds(10))
                .Until(drv => drv.FindElement(MedicalFileLocators.LabResults));
            element.Click();
            System.Threading.Thread.Sleep(1000);
        }

        public void SelectLabTest()
        {
            System.Threading.Thread.Sleep(2000);
            var elements = _driver.FindElements(MedicalFileLocators.FirstLabResult);

            if (elements.Count > 0)
            {
                elements[0].Click();
            }
            else
            {
                throw new NoSuchElementException("No lab test results found");
            }
        }

        public void NavigateToLabTest()
        {
            TapLabTests();
            SelectLabTest();
        }

        public bool IsUniqueLabTestVisible()
        {
            try
            {
                return _driver.FindElement(MedicalFileLocators.UniqueLabTest).Displayed;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

    }
}
