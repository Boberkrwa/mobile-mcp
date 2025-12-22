using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
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

        public void IDinput(string text) =>
            _driver.FindElement(HomePageLocators.IdInput).SendKeys(text);

        public void PasswordField(string text = "Aa123456") =>
            _driver.FindElement(HomePageLocators.PasswordInput).SendKeys(text);

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
        public void TapLoginButton() =>
            _driver.FindElement(HomePageLocators.LoginButton).Click();
        public void TapYourBagButton() =>
            _driver.FindElement(HomePageLocators.YourBagButton).Click();

        public void TapYourBagFirstIndex() =>
            _driver.FindElement(HomePageLocators.YOurBagFirstIndex).Click();

        public bool IsYourBagFirstIndexMarked()
        {
            var el = _driver.FindElement(HomePageLocators.YOurBagFirstIndex);
            try
            {
                var selected = el.GetAttribute("selected");
                var checkedAttr = el.GetAttribute("checked");
                var contentDesc = el.GetAttribute("contentDescription") ?? string.Empty;
                System.Console.WriteLine($"[FirstIndex] selected={selected}, checked={checkedAttr}, contentDesc='{contentDesc}'");

                if (string.Equals(selected, "true", StringComparison.OrdinalIgnoreCase)) return true;
                if (string.Equals(checkedAttr, "true", StringComparison.OrdinalIgnoreCase)) return true;
                if (contentDesc.Contains("selected", StringComparison.OrdinalIgnoreCase) || contentDesc.Contains("מסומן", StringComparison.OrdinalIgnoreCase) || contentDesc.Contains("נבחר", StringComparison.OrdinalIgnoreCase)) return true;

                // Check for a descendant CheckBox that is checked
                var checkBoxes = el.FindElements(OpenQA.Selenium.By.ClassName("android.widget.CheckBox"));
                System.Console.WriteLine($"[FirstIndex] Descendant CheckBoxes count={checkBoxes.Count}");
                foreach (var cb in checkBoxes)
                {
                    var cbChecked = cb.GetAttribute("checked");
                    System.Console.WriteLine($"[FirstIndex] CheckBox checked={cbChecked}");
                    if (string.Equals(cbChecked, "true", StringComparison.OrdinalIgnoreCase)) return true;
                }

                // Check for any descendant ImageView or view marked as selected
                var selectedViews = el.FindElements(OpenQA.Selenium.By.XPath(".//android.view.View[@selected='true']|.//android.widget.ImageView[@selected='true']"));
                System.Console.WriteLine($"[FirstIndex] Selected descendant views count={selectedViews.Count}");
                if (selectedViews.Count > 0) return true;

                // Check any descendant with content-desc indicating selection
                var descViews = el.FindElements(OpenQA.Selenium.By.XPath(".//*[@content-desc]"));
                foreach (var v in descViews)
                {
                    var desc = v.GetAttribute("contentDescription") ?? string.Empty;
                    if (desc.Contains("selected", StringComparison.OrdinalIgnoreCase) || desc.Contains("מסומן", StringComparison.OrdinalIgnoreCase) || desc.Contains("נבחר", StringComparison.OrdinalIgnoreCase))
                    {
                        System.Console.WriteLine($"[FirstIndex] Found selection content-desc='{desc}'");
                        return true;
                    }
                }

                return false;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"[FirstIndex] Error detecting marked state: {ex.Message}");
                return false;
            }
        }

        public bool IsYourListHasCount(int expected = 1)
        {
            try
            {
                var el = _driver.FindElement(HomePageLocators.YourList);
                var text = el.Text ?? string.Empty;
                System.Console.WriteLine($"[YourListButton] text='{text}'");
                return text.Contains($"({expected})");
            }
            catch
            {
                return false;
            }
        }

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
