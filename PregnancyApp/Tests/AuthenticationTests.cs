using NUnit.Framework;
using NUnit.Framework.Legacy;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class AuthenticationTests
    {
        private AndroidDriver? _driver;

        [SetUp]
        public void SetUp()
        {
            _driver = DriverManager.GetSharedDriver();
            _driver.ActivateApp(Config.AppConfig.AppPackage);
        }

        [TearDown]
        public void TearDown()
        {
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    _driver?.PressKeyCode(4);
                }
                catch
                {
                    break;
                }
            }
        }

        [Test(Description = "Test Case: 118836, 118864, 120191"), Order(1)]
        public void LogInAndEnterLabTest()
        {
            var homePage = new HomePage(_driver!);
            homePage.NavigateToPersonalMedicalFile();
            var loginPage = new LoginPage(_driver!);
            loginPage.Login(TestData.ValidUserId, TestData.ValidPassword);
            var medicalFile = new MedicalFile(_driver!);
            medicalFile.NavigateToLabTest();
            ClassicAssert.IsTrue(medicalFile.IsUniqueLabTestVisible(), "Unique lab test is not visible");
        }

        [Test, Order(2)]
        public void FailedLogin()
        {
            var homePage = new HomePage(_driver!);
            homePage.NavigateToPersonalMedicalFile();
            var loginPage = new LoginPage(_driver!);
            loginPage.EnterId(TestData.ValidUserId);
            loginPage.EnterPassword(TestData.InvalidPassword);
            loginPage.ClickLoginButton();
            loginPage.CloseErrorPopup();
        }
    }
}
