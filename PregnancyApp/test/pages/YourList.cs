using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests.Pages
{
    public class YourList
    {
        private readonly AndroidDriver _driver;

        public YourList(AndroidDriver driver)
        {
            _driver = driver;
        }

        public void MarkFirstIndexIfNeededAndNavigate(HomePage homePage)
        {
            if (!homePage.IsPageAlreadyHasCount(1))
            {
                homePage.TapYourBagFirstIndex();
            }
            TapYourList();
        }

        public void TapYourList() =>
            _driver.FindElement(HomePageLocators.YourList).Click();

        public bool IsTitleShowingCount(int expected = 1)
        {
            try
            {
                var textMatches = _driver.FindElements(By.XPath($"//*[contains(@text, '({expected})')]"));
                if (textMatches.Count > 0)
                {
                    System.Console.WriteLine($"[YourListTitle] Found via text");
                    return true;
                }
                var descMatches = _driver.FindElements(By.XPath($"//*[@content-desc and contains(@content-desc, '({expected})')]"));
                if (descMatches.Count > 0)
                {
                    System.Console.WriteLine($"[YourListTitle] Found via content-desc");
                    return true;
                }
                System.Console.WriteLine($"[YourListTitle] Not found");
                return false;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"[YourListTitle] Error: {ex.Message}");
                return false;
            }
        }

        public void TapOptionsButton() =>
            _driver.FindElement(YourListLocators.YourListOptionsButton).Click();

        public void TapDeleteButton() =>
            _driver.FindElement(YourListLocators.YourListDeleteButton).Click();

        public void CheckDeleteItemCheckbox() =>
            _driver.FindElement(YourListLocators.DeleteItemCheckbox).Click();

        public void ConfirmDelete() =>
            _driver.FindElement(YourListLocators.ConfirmDeleteButton).Click();

        public void DeleteItem()
        {
            TapOptionsButton();
            TapDeleteButton();
            CheckDeleteItemCheckbox();
            ConfirmDelete();
        }
    }
}
