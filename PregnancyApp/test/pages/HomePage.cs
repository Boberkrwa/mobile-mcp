using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using System;

namespace PregnancyApp.Tests.Pages
{
    public class HomePage
    {
        private readonly AndroidDriver _driver;

        #region Constructor

        public HomePage(AndroidDriver driver)
        {
            _driver = driver;
        }

        #endregion

        #region Navigation

        public void TapPersonalArea()
        {
            _driver.FindElement(HomePageLocators.PersonalAreaButton).Click();
        }

        public void TapPersonalMedicalFile() =>
            _driver.FindElement(HomePageLocators.PersonalMedicalFileButton).Click();

        public void NavigateToPersonalMedicalFile()
        {
            TapPersonalArea();
            TapPersonalMedicalFile();
        }

        public void GoBack()
        {
            TryPressBack();
        }

        #endregion

        #region Fetus Movement Tracking

        public void FetusMovementButton() =>
            _driver.FindElement(HomePageLocators.FetusMovementButton).Click();

        public void StartFetusMovement()
        {
            // Temporarily disable implicit wait for faster checks
            _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(1);

            try
            {
                // Try the first locator (initial click)
                var elements = _driver.FindElements(HomePageLocators.StartFetusMovement);
                if (elements.Count > 0)
                {
                    elements[0].Click();
                }
                else
                {
                    // Try the alternative locator (repeated clicks)
                    var alternativeLocator = By.XPath("//android.widget.FrameLayout[@content-desc=\"לחצן הרגשתי תנועה\"]/android.widget.FrameLayout/android.widget.ImageView");
                    _driver.FindElement(alternativeLocator).Click();
                }
            }
            finally
            {
                // Restore implicit wait
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);
            }
        }

        public void FinishTrackingButton() =>
            _driver.FindElement(HomePageLocators.FinishTrackingButton).Click();

        public void TrackFetusMovement(int count = 3)
        {
            FetusMovementButton();
            for (int i = 0; i < count; i++)
            {
                StartFetusMovement();
            }
            FinishTrackingButton();
        }

        #endregion

        #region Contractions Tracking

        public void TapContractionsTrackingIcon() =>
            _driver.FindElement(HomePageLocators.ContractionIcon).Click();

        public void ContractionTracking() =>
            _driver.FindElement(HomePageLocators.AnyImageView).Click();

        public void ResetContractionsTracking() =>
            _driver.FindElement(HomePageLocators.ResetContractionsButton).Click();

        #endregion

        #region Labor Bag / Your List
        public void TapYourBagButton() =>
            _driver.FindElement(HomePageLocators.YourBagButton).Click();

        public void TapYourBagFirstIndex() =>
            _driver.FindElement(HomePageLocators.YOurBagFirstIndex).Click();

        public bool IsPageAlreadyHasCount(int expected = 1)
        {
            var textMatches = _driver.FindElements(By.XPath($"//*[contains(@text, '({expected})')]"));
            if (textMatches.Count > 0) return true;

            var descMatches = _driver.FindElements(By.XPath($"//*[@content-desc and contains(@content-desc, '({expected})')]"));
            return descMatches.Count > 0;
        }

        #endregion

        #region Week Information

        public void TapWeekInfoButton() =>
            _driver.FindElement(HomePageLocators.WeekInfoButton).Click();

        public void ScrollWeekForward() =>
            _driver.FindElement(HomePageLocators.WeekRightArrow).Click();

        public void ScrollWeekBackwards() =>
            _driver.FindElement(HomePageLocators.WeekLeftArrow).Click();

        #endregion

        #region Rights and Forms

        public void TapYourRights() =>
            _driver.FindElement(HomePageLocators.EligibilitySectionRoot).Click();

        public void TapJoiningMaccabiForm() =>
            _driver.FindElement(HomePageLocators.JoiningMaccabiFormCard).Click();

        #endregion

        #region Articles

        public void TapFirstArticle() =>
            _driver.FindElement(HomePageLocators.ArticlesFirstPanel).Click();

        public void TapThirdArticle() =>
            _driver.FindElement(HomePageLocators.ArticlesThirdCard).Click();

        #endregion

        #region Pregnancy Binder


        public void TapPregnancyBinder() =>
            _driver.FindElement(HomePageLocators.PregnancyBinderButton).Click();

        public void TapFileAddButton() =>
            _driver.FindElement(HomePageLocators.FloatingActionButton).Click();

        public void TapMyFilesOption() =>
            _driver.FindElement(HomePageLocators.MyFilesOption).Click();

        public void SelectFirstFile()
        {
            AcceptPermissionsIfPresent();
            var originalWait = _driver.Manage().Timeouts().ImplicitWait;
            try
            {
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);
                var thumbBy = By.XPath("(//android.widget.ImageView[@resource-id=\"com.google.android.documentsui:id/icon_thumb\"]) [1]");
                var elements = _driver.FindElements(thumbBy);
                if (elements.Count > 0)
                {
                    elements[0].Click();
                }
                ConfirmGallerySelectionIfPresent();
            }
            finally
            {
                _driver.Manage().Timeouts().ImplicitWait = originalWait;
            }
        }

        public void TapSaveButton()
        {
            var originalWait = _driver.Manage().Timeouts().ImplicitWait;
            try
            {
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(6);
                var tapped = TryTap(HomePageLocators.SaveButton)
                    || TryTap(HomePageLocators.DocumentsUiDone)
                    || TryTap(HomePageLocators.SystemPositiveButton)
                    || TryTap(By.XPath("//*[contains(@text,'Save') or contains(@text,'שמור') or contains(@text,'שמירה') or contains(@content-desc,'Save')]"));
                if (!tapped)
                {
                    // As a fallback, try common confirm/OK buttons again
                    tapped = TryTap(By.Id("android:id/button1"))
                        || TryTap(By.XPath("//*[contains(@text,'OK') or contains(@text,'אישור') or contains(@text,'סיום') or contains(@text,'Done')]"));
                }
                if (!tapped)
                {
                    // If still not found, try going back once and re-check
                    TryPressBack();
                    _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);
                    tapped = TryTap(HomePageLocators.SaveButton)
                        || TryTap(By.XPath("//*[contains(@text,'Save') or contains(@text,'שמור') or contains(@text,'שמירה') or contains(@content-desc,'Save')]"))
                        || TryTap(HomePageLocators.SystemPositiveButton);
                }
            }
            finally
            {
                _driver.Manage().Timeouts().ImplicitWait = originalWait;
            }
        }

        public void TapOptionsButton() =>
            _driver.FindElement(HomePageLocators.MoreImageButton).Click();

        public void TapDeleteButton() =>
            _driver.FindElement(HomePageLocators.DeleteButton).Click();

        public void SelectPregnancyFolderCheckbox() =>
            _driver.FindElement(HomePageLocators.PregnancyFolderCheckbox).Click();

        public void TapDeleteAction() =>
            _driver.FindElement(HomePageLocators.DeleteActionButton).Click();

        public void ConfirmFileDeletion() =>
            _driver.FindElement(HomePageLocators.ConfirmDeleteButton).Click();

        #endregion

        #region Helper Methods

        public void AcceptPermissionsIfPresent()
        {
            var originalWait = _driver.Manage().Timeouts().ImplicitWait;
            try
            {
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(1);
                var candidates = new By[]
                {
                    HomePageLocators.PermissionAllowButton,
                    HomePageLocators.SystemPositiveButton,
                };
                foreach (var by in candidates)
                {
                    var els = _driver.FindElements(by);
                    if (els.Count > 0)
                    {
                        els[0].Click();
                        break;
                    }
                }
            }
            finally
            {
                _driver.Manage().Timeouts().ImplicitWait = originalWait;
            }
        }

        public void ConfirmGallerySelectionIfPresent()
        {
            var originalWait = _driver.Manage().Timeouts().ImplicitWait;
            try
            {
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(1);
                var candidates = new By[]
                {
                    HomePageLocators.DocumentsUiDone,
                    HomePageLocators.SystemPositiveButton,
                    By.XPath("//*[contains(@text,'Open') or contains(@text,'פתח') or contains(@content-desc,'Open')]")
                };
                foreach (var by in candidates)
                {
                    var els = _driver.FindElements(by);
                    if (els.Count > 0)
                    {
                        els[0].Click();
                        break;
                    }
                }
            }
            finally
            {
                _driver.Manage().Timeouts().ImplicitWait = originalWait;
            }
        }

        private bool TryTap(By by)
        {
            var elements = _driver.FindElements(by);
            if (elements.Count > 0)
            {
                elements[0].Click();
                return true;
            }
            return false;
        }



        private void TryPressBack()
        {
            try
            {
                _driver.PressKeyCode(4);
            }
            catch { }
        }

        #endregion
    }
}
