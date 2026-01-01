using NUnit.Framework;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using PregnancyApp.Tests.Pages;

namespace PregnancyApp.Tests
{
    public class PersonalAreaTests
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

        [Test(Description = "Test Case: 120220"), Order(3)]
        public void TrackingFetusMovement()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickPersonalArea();
            homePage.TrackFetusMovement(4);
        }

        [Test(Description = "Test Case: 120218"), Order(4)]
        public void TrackingContractions()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickPersonalArea();
            homePage.ClickContractionsTrackingIcon();
            homePage.ContractionTracking();
            homePage.ContractionTracking();
            homePage.ResetContractionsTracking();
        }

        [Test(Description = "Test Case: 109350"), Order(5)]
        public void UploadImageToPregnancyBinder()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickPersonalArea();
            homePage.ClickPregnancyBinder();
            homePage.ClickFileAddButton();
            homePage.ClickMyFilesOption();
            homePage.SelectFirstFile();
            homePage.ClickSaveButton();
            homePage.ClickOptionsButton();
            homePage.ClickDeleteButton();
            homePage.SelectPregnancyFolderCheckbox();
            homePage.ClickDeleteAction();
            homePage.ConfirmFileDeletion();
        }

        [Test(Description = "Test Case: 120192, 116107"), Order(6)]
        public void ChangePersonalDetails()
        {
            var homePage = new HomePage(_driver!);
            homePage.ClickPersonalArea();
            homePage.ClickAvatarButton();
            homePage.ClickProfilePictureImageUpload();
            homePage.ClickProfilePictureSelectingGallery();
            homePage.SelectFirstFile();
            homePage.ClickImageSelectConfirmButton();
            homePage.ClickLastCycleDateCalendar();
            homePage.SelectRandomDate();
            homePage.ClickCalendarConfirmButton();
            homePage.SelectDifferentFetusCount();
            homePage.ClickProfileSaveButton();
        }
    }
}
