using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
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

        public void TapLabTests() =>
            _driver.FindElement(MedicalFileLocators.LabResults).Click();

        public void SelectLabTest() =>
            _driver.FindElement(MedicalFileLocators.FirstLabResult).Click();

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