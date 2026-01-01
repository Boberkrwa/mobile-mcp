using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests.Pages
{
    public class LoginPage
    {
        private readonly AndroidDriver _driver;

        public LoginPage(AndroidDriver driver)
        {
            _driver = driver;
        }

        public void EnterId(string text) =>
            _driver.FindElement(LoginPageLocators.IdInput).SendKeys(text);

        public void EnterPassword(string text) =>
            _driver.FindElement(LoginPageLocators.PasswordInput).SendKeys(text);

        public void ClickLoginButton() =>
            _driver.FindElement(LoginPageLocators.LoginButton).Click();

        public void Login(string userId, string password)
        {
            EnterId(userId);
            EnterPassword(password);
            ClickLoginButton();
        }

        public void CloseErrorPopup() =>
            _driver.FindElement(LoginPageLocators.ErrorPopupConfirmButton).Click();
    }
}
