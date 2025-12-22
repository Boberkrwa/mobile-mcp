using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using PregnancyApp.Helpers;
using System;

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
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
            var element = wait.Until(drv => drv.FindElement(MedicalFileLocators.LabResults));
            element.Click();
            System.Threading.Thread.Sleep(1000); // Wait for lab results list to load
        }

        public void SelectLabTest()
        {
            try
            {
                // Wait for lab results to load
                System.Threading.Thread.Sleep(2000);

                // Try to find elements
                var elements = _driver.FindElements(MedicalFileLocators.FirstLabResult);
                System.Console.WriteLine($"Found {elements.Count} lab test elements");

                if (elements.Count > 0)
                {
                    elements[0].Click();
                }
                else
                {
                    // Try alternative - maybe need to find by a different locator
                    var allTextViews = _driver.FindElements(By.ClassName("android.widget.TextView"));
                    System.Console.WriteLine($"Total TextViews: {allTextViews.Count}");
                    throw new NoSuchElementException("No lab test results found with nameOfTestTextView");
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"Error in SelectLabTest: {ex.Message}");
                throw;
            }
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

        public void NavigateToLabTest()
        {
            TapLabTests();
            SelectLabTest();
        }
    }
}