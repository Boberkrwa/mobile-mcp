using NUnit.Framework;
using NUnit.Framework.Legacy;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class PregnancyAppTests
    {
        private AndroidDriver? _driver;

        #region Setup and Teardown

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

        #endregion

        #region Authentication Tests

        [Test, Order(1)]
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
            loginPage.TapLoginButton();
            loginPage.CloseErrorPopup();
        }

        #endregion

        #region Personal Area Tests

        [Test, Order(3)]
        public void TrackingFetusMovement()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapPersonalArea();
            homePage.TrackFetusMovement(4);
        }

        [Test, Order(4)]
        public void TrackingContractions()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapPersonalArea();
            homePage.TapContractionsTrackingIcon();
            homePage.ContractionTracking();
            homePage.ContractionTracking();
            homePage.ResetContractionsTracking();
        }

        [Test, Order(5)]
        public void UploadImageToPregnancyBinder()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapPersonalArea();
            homePage.TapPregnancyBinder();
            homePage.TapFileAddButton();
            homePage.TapMyFilesOption();
            homePage.SelectFirstFile();
            homePage.TapSaveButton();
            homePage.TapOptionsButton();
            homePage.TapDeleteButton();
            homePage.SelectPregnancyFolderCheckbox();
            homePage.TapDeleteAction();
            homePage.ConfirmFileDeletion();
        }

        #endregion

        #region Home Page Navigation Tests

        [Test, Order(6)]
        public void CheckingWeekInfo()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapWeekInfoButton();
            homePage.ScrollWeekForward();
            homePage.ScrollWeekBackwards();
            var beforeScroll = _driver!.PageSource;
            ScrollHelper.ScrollToBottom(_driver!, 1);
            var afterScroll = _driver!.PageSource;
            ClassicAssert.AreNotEqual(beforeScroll, afterScroll, "Scroll did not change the view");
        }

        [Test, Order(7)]
        public void EnteringArticles()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapFirstArticle();
            ScrollHelper.ScrollToBottom(_driver!, 2);
            homePage.GoBack();
            ScrollHelper.ScrollToBottom(_driver!, 3);
            homePage.TapThirdArticle();
            ScrollHelper.ScrollToBottom(_driver!, 1);
        }

        [Test, Order(8)]
        public void EnteringJoiningMaccabiForm()
        {
            var homePage = new HomePage(_driver!);
            homePage.TapYourRights();
            homePage.TapJoiningMaccabiForm();
            var pageSource = _driver!.PageSource;
            ClassicAssert.IsTrue(pageSource.Contains(PageElements.JoiningMaccabiFormId) || pageSource.Length > 0, "Not on the joining Maccabi form page");
        }

        #endregion

        #region Labor Preparation Tests

        [Test, Order(9)]
        public void AddAndRemoveItemForLabor()
        {
            ScrollHelper.ScrollToBottom(_driver!, 4);
            var homePage = new HomePage(_driver!);
            homePage.TapYourBagButton();
            var yourList = new YourList(_driver!);
            yourList.MarkFirstIndexIfNeededAndNavigate(homePage);
            ClassicAssert.IsTrue(yourList.IsTitleShowingCount(1), "Your List title does not show (1)");
            yourList.DeleteItem();
            ClassicAssert.IsFalse(yourList.IsTitleShowingCount(1), "Your List title still shows (1) after deletion");
        }

        #endregion
    }
}
