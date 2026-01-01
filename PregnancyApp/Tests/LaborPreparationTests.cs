using NUnit.Framework;
using NUnit.Framework.Legacy;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class LaborPreparationTests
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

        [Test(Description = "Test Case: 120215"), Order(9)]
        public void AddAndRemoveItemForLabor()
        {
            ScrollHelper.ScrollAction(_driver!, 4);
            var homePage = new HomePage(_driver!);
            homePage.ClickYourBagButton();
            var yourList = new YourList(_driver!);
            yourList.MarkFirstIndexIfNeededAndNavigate(homePage);
            ClassicAssert.IsTrue(yourList.IsTitleShowingCount(1), "Your List title does not show (1)");
            yourList.DeleteItem();
            ClassicAssert.IsFalse(yourList.IsTitleShowingCount(1), "Your List title still shows (1) after deletion");
        }
    }
}
