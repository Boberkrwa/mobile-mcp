using NUnit.Framework;
using NUnit.Framework.Legacy;
using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class PregnancyAppTests
    {
        private AndroidDriver? _driver;

        [TearDown]
        public void TearDown()
        {
            NavigateBackToHome();
        }

        private void NavigateBackToHome()
        {
            // KeyCode 4 is back button on Android
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    _driver?.PressKeyCode(4);
                    System.Threading.Thread.Sleep(500);
                }
                catch
                {
                    break;
                }
            }
        }

        [Test(Description = "Login and verify unique lab test is visible")]
        public void LoggInAndEnterLabTest()
        {
            _driver = DriverManager.GetSharedDriver();
            var homePage = new HomePage(_driver);
            homePage.TapPersonalArea();
            homePage.TapPersonalMedicalFile();
            var loginPage = new LoginPage(_driver);
            loginPage.EnterId(TestData.ValidUserId);
            loginPage.EnterPassword(TestData.ValidPassword);
            loginPage.TapLoginButton();
            var medicalFile = new MedicalFile(_driver);
            medicalFile.TapLabTests();
            medicalFile.SelectLabTest();
            ClassicAssert.IsTrue(medicalFile.IsUniqueLabTestVisible(), "Unique lab test is not visible");
        }
    }
}
