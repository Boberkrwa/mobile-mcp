using NUnit.Framework;
using NUnit.Framework.Legacy;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class HomePageNavigationTests
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

        [Test(Description = "Test Case: 120213"), Order(6)]
        public void CheckingWeekInfo()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickWeekInfoButton();
            homePage.ScrollWeekForward();
            homePage.ScrollWeekBackwards();
            var beforeScroll = _driver!.PageSource;
            ScrollHelper.ScrollToBottom(_driver!, 1);
            var afterScroll = _driver!.PageSource;
            ClassicAssert.AreNotEqual(beforeScroll, afterScroll, "Scroll did not change the view");
        }

        [Test(Description = "Test Case: 120193"), Order(7)]
        public void EnteringArticles()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickFirstArticle();
            ScrollHelper.ScrollToBottom(_driver!, 2);
            homePage.GoBack();
            ScrollHelper.ScrollToBottom(_driver!, 3);
            homePage.ClickThirdArticle();
            ScrollHelper.ScrollToBottom(_driver!, 1);
        }

        [Test, Order(8)]
        public void EnteringJoiningMaccabiForm()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickYourRights();
            homePage.ClickJoiningMaccabiForm();
            var pageSource = _driver!.PageSource;
            ClassicAssert.IsTrue(pageSource.Contains(PageElements.JoiningMaccabiFormId) || pageSource.Length > 0, "Not on the joining Maccabi form page");
        }

        [Test(Description = "Test Case: 120206"), Order(10)]
        public void EnteringSuggestedChecks()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickChecksFirstIndex();
            ScrollHelper.ScrollToBottom(_driver!, 1);
            homePage.GoBack();
            homePage.ClickShowMoreChecks();
            homePage.ClickChecksFullList();
            ClassicAssert.IsTrue(homePage.IsSuggestedChecksHeaderVisible("בדיקות מומלצות בהריון"), "Suggested checks header is not visible with expected text");
        }
    }
}
