using OpenQA.Selenium;

namespace PregnancyApp.Helpers
{
    public static class LoginPageLocators
    {
        public static readonly By IdInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditText");
        public static readonly By PasswordInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditTextPassword");
        public static readonly By LoginButton = By.Id("com.ideomobile.maccabipregnancy:id/enterButton");
    }
}
