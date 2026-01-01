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

        public void ClickOptionsButton() =>
            _driver.FindElement(YourListLocators.YourListOptionsButton).Click();

        public void ClickDeleteButton() =>
            _driver.FindElement(YourListLocators.YourListDeleteButton).Click();

        public void CheckDeleteItemCheckbox() =>
            _driver.FindElement(YourListLocators.DeleteItemCheckbox).Click();

        public void ConfirmDelete() =>
            _driver.FindElement(YourListLocators.ConfirmDeleteButton).Click();

        public void DeleteItem()
        {
            ClickOptionsButton();
            ClickDeleteButton();
            CheckDeleteItemCheckbox();
            ConfirmDelete();
        }

        public void MarkFirstIndexIfNeededAndNavigate(HomePage homePage)
        {
            try
            {
                var firstIndex = _driver.FindElement(HomePageLocators.YourBagFirstIndex);

                // Check multiple attributes that might indicate marked/selected state
                var isChecked = firstIndex.GetAttribute("checked");
                var isSelected = firstIndex.GetAttribute("selected");
                var isFocused = firstIndex.GetAttribute("focused");

                // Only click if none of the attributes indicate it's already marked
                if (isChecked != "true" && isSelected != "true" && isFocused != "true")
                {
                    homePage.ClickYourFileFirstIndex();
                }
            }
            catch
            {
                // If element not found, do nothing - we can't mark it
            }

            _driver.FindElement(YourListLocators.MyListTitle).Click();
        }

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
    }
}
