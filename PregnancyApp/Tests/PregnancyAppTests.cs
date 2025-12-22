using NUnit.Framework;
using NUnit.Framework.Legacy;
using OpenQA.Selenium.Appium.Android;
using System;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class PregnancyAppTests
    {
        private AndroidDriver? _driver;

        [SetUp]
        public void SetUp()
        {
            _driver = DriverManager.GetSharedDriver();
            _driver.ActivateApp(PregnancyApp.Config.AppConfig.AppPackage);
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

        [Test]
        public void LogInAndEnterLabTest()
        {
            var homePage = new HomePage(_driver!);
            homePage.NavigateToPersonalMedicalFile();
            var loginPage = new LoginPage(_driver);
            loginPage.Login(TestData.ValidUserId, TestData.ValidPassword);
            var medicalFile = new MedicalFile(_driver);
            medicalFile.NavigateToLabTest();
            ClassicAssert.IsTrue(medicalFile.IsUniqueLabTestVisible(), "Unique lab test is not visible");
        }

        [Test]
        public void AddAndRemoveItemForLabor()
        {
            ScrollHelper.ScrollToBottom(_driver!, 3);
            var homePage = new HomePage(_driver!);
            homePage.TapYourBagButton();
            var yourList = new YourList(_driver);
            yourList.MarkFirstIndexIfNeededAndNavigate(homePage);
            ClassicAssert.IsTrue(yourList.IsTitleShowingCount(1), "Your List title does not show (1)");
            yourList.DeleteItem();
            ClassicAssert.IsFalse(yourList.IsTitleShowingCount(1), "Your List title still shows (1) after deletion");
        }

        [Test]
        public void TrackingFetusMovement()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapPersonalArea();
            homePage.TrackFetusMovement(4);
        }
    }
}
