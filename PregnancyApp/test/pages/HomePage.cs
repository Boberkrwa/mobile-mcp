using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using System;

namespace PregnancyApp.Tests.Pages
{
    public class HomePage
    {
        private readonly AndroidDriver _driver;

        public HomePage(AndroidDriver driver)
        {
            _driver = driver;
        }

        public void TapPersonalArea()
        {
            _driver.FindElement(HomePageLocators.PersonalAreaButton).Click();
        }

        public void TapPersonalMedicalFile() =>
            _driver.FindElement(HomePageLocators.PersonalMedicalFileButton).Click();

        public void NavigateToPersonalMedicalFile()
        {
            TapPersonalArea();
            TapPersonalMedicalFile();
        }

        public void FetusMovementButton() =>
            _driver.FindElement(HomePageLocators.FetusMovementButton).Click();

        public void StartFetusMovement()
        {
            // Temporarily disable implicit wait for faster checks
            _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(1);

            try
            {
                // Try the first locator (initial click)
                var elements = _driver.FindElements(HomePageLocators.StartFetusMovement);
                if (elements.Count > 0)
                {
                    elements[0].Click();
                }
                else
                {
                    // Try the alternative locator (repeated clicks)
                    var alternativeLocator = By.XPath("//android.widget.FrameLayout[@content-desc=\"לחצן הרגשתי תנועה\"]/android.widget.FrameLayout/android.widget.ImageView");
                    _driver.FindElement(alternativeLocator).Click();
                }
            }
            finally
            {
                // Restore implicit wait
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);
            }
        }

        public void FinishTrackingButton() =>
            _driver.FindElement(HomePageLocators.FinishTrackingButton).Click();

        public void TrackFetusMovement(int count = 3)
        {
            FetusMovementButton();
            for (int i = 0; i < count; i++)
            {
                StartFetusMovement();
            }
            FinishTrackingButton();
        }
        public void TapYourBagButton() =>
            _driver.FindElement(HomePageLocators.YourBagButton).Click();

        public void TapYourBagFirstIndex() =>
            _driver.FindElement(HomePageLocators.YOurBagFirstIndex).Click();

        public bool IsPageAlreadyHasCount(int expected = 1)
        {
            try
            {
                // Quick check - no wait, just find immediately
                var textMatches = _driver.FindElements(By.XPath($"//*[contains(@text, '({expected})')]"));
                if (textMatches.Count > 0)
                {
                    System.Console.WriteLine($"[PageCheck] Found via text");
                    return true;
                }
                var descMatches = _driver.FindElements(By.XPath($"//*[@content-desc and contains(@content-desc, '({expected})')]"));
                if (descMatches.Count > 0)
                {
                    System.Console.WriteLine($"[PageCheck] Found via content-desc");
                    return true;
                }
                System.Console.WriteLine($"[PageCheck] Not found");
                return false;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"[PageCheck] Error: {ex.Message}");
                return false;
            }
        }
    }
}
