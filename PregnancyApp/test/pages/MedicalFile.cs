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

        public void ClickBloodTests()
        {
            var element = new WebDriverWait(_driver, TimeSpan.FromSeconds(10))
                .Until(drv => drv.FindElement(MedicalFileLocators.LabResults));
            element.Click();
        }

        public void CheckIfUrineTestButtonIsVisible()
        {
            try
            {
                var element = _driver.FindElement(MedicalFileLocators.UrineTestButton);
                if (element.Displayed)
                {
                    throw new Exception("Urine Test button should not be visible but it is");
                }
            }
            catch (NoSuchElementException)
            {
                // Expected - button should not be found
            }
        }
        public void SelectBloodTest()
        {
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
            ClickBloodTests();
            SelectBloodTest();
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

        public void ClickUltraSoundTestsTab()
        {
            var element = new WebDriverWait(_driver, TimeSpan.FromSeconds(10))
                .Until(drv => drv.FindElement(MedicalFileLocators.UltraSoundTests));
            element.Click();
        }

        public bool IsBiochemichalContainerEmpty()
        {
            try
            {
                var container = _driver.FindElement(By.Id("com.ideomobile.maccabipregnancy:id/flRecyclerContainer"));
                // Check for RecyclerView inside the container
                var recyclerView = container.FindElements(By.XPath(".//androidx.recyclerview.widget.RecyclerView"));
                if (recyclerView.Count == 0)
                {
                    return true;
                }
                // If RecyclerView exists, check if it has child items
                var items = recyclerView[0].FindElements(By.XPath("./*"));
                return items.Count == 0;
            }
            catch
            {
                return true;
            }
        }

    }
}
