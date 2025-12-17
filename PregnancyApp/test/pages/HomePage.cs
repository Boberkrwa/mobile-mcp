using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests.Pages
{
    public class HomePage
    {
        private readonly AndroidDriver _driver;

        public HomePage(AndroidDriver driver)
        {
            _driver = driver;
        }

        public void TapPersonalArea() =>
            _driver.FindElement(HomePageLocators.PersonalAreaButton).Click();

        public void TapPersonalMedicalFile() =>
            _driver.FindElement(HomePageLocators.PersonalMedicalFileButton).Click();

        public void IDinput(string text) =>
            _driver.FindElement(HomePageLocators.IdInput).SendKeys(text);

        public void PasswordField(string text = "Aa123456") =>
            _driver.FindElement(HomePageLocators.PasswordInput).SendKeys(text);

        public void TapLoginButton() =>
            _driver.FindElement(HomePageLocators.LoginButton).Click();
    }
}
