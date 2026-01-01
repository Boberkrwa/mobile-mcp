using OpenQA.Selenium;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace PregnancyApp.Tests.Pages
{
    public class HomePage
    {
        private readonly AndroidDriver _driver;

        public HomePage(AndroidDriver driver)
        {
            _driver = driver;
        }

        public void FetusMovementButton() =>
            _driver.FindElement(HomePageLocators.FetusMovementButton).Click();

        public void StartFetusMovement()
        {
            var possibleCounts = new int[] { 1, 2, 3 };

            // Picker exists
            var picker = _driver.FindElement(By.Id("com.ideomobile.maccabipregnancy:id/numberPickerView"));

            // Detect current value (primary: EditText inside picker)
            int currentCount = -1;
            try
            {
                var edit = picker.FindElements(By.XPath(".//android.widget.EditText")).FirstOrDefault();
                if (edit != null && int.TryParse(edit.Text, out var val)) currentCount = val;
            }
            catch { }

            if (currentCount == -1)
            {
                // Secondary: detect selected attribute on child TextViews
                foreach (var c in possibleCounts)
                {
                    var el = picker.FindElements(By.XPath($".//android.widget.TextView[@content-desc='{c}']")).FirstOrDefault();
                    if (el != null)
                    {
                        var sel = (el.GetAttribute("selected") ?? el.GetAttribute("checked") ?? el.GetAttribute("focused") ?? string.Empty).ToLower();
                        if (sel.Contains("true"))
                        {
                            currentCount = c;
                            break;
                        }
                    }
                }
            }

            if (currentCount == -1) currentCount = possibleCounts[0];

            var alternatives = possibleCounts.Where(c => c != currentCount).ToArray();
            var rnd = new Random();
            var choice = alternatives[rnd.Next(alternatives.Length)];

            TestContext.Progress.WriteLine($"[SelectDifferentFetusCount] current={currentCount}, choice={choice}");

            // Click the chosen option inside the picker (or globally as fallback)
            var target = picker.FindElements(By.XPath($".//android.widget.TextView[@content-desc='{choice}']")).FirstOrDefault()
                         ?? _driver.FindElements(By.XPath($"//android.widget.TextView[@content-desc='{choice}']")).FirstOrDefault();
            if (target != null)
            {
                target.Click();
                System.Threading.Thread.Sleep(300);
            }

            // Verify new value
            try
            {
                var editAfter = picker.FindElements(By.XPath(".//android.widget.EditText")).FirstOrDefault();
                if (editAfter != null)
                {
                    TestContext.Progress.WriteLine($"[SelectDifferentFetusCount] after={editAfter.Text}");
                }
                else
                {
                    TestContext.Progress.WriteLine("[SelectDifferentFetusCount] after=unknown (no EditText)");
                }
            }
            catch (Exception ex)
            {
                TestContext.Progress.WriteLine($"[SelectDifferentFetusCount] verify error: {ex.Message}");
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

        public void ClickContractionsTrackingIcon() =>
            _driver.FindElement(HomePageLocators.ContractionIcon).Click();

        public void ContractionTracking() =>
            _driver.FindElement(HomePageLocators.AnyImageView).Click();

        public void ResetContractionsTracking() =>
            _driver.FindElement(HomePageLocators.ResetContractionsButton).Click();

        public void ClickYourBagButton() =>
            _driver.FindElement(HomePageLocators.YourBagButton).Click();

        public void ClickYourBagFirstIndex() =>
            _driver.FindElement(HomePageLocators.YOurBagFirstIndex).Click();

        public bool IsPageAlreadyHasCount(int expected = 1)
        {
            var textMatches = _driver.FindElements(By.XPath($"//*[contains(@text, '({expected})')]"));
            if (textMatches.Count > 0) return true;

            var descMatches = _driver.FindElements(By.XPath($"//*[@content-desc and contains(@content-desc, '({expected})')]"));
            return descMatches.Count > 0;
        }

        public void ClickWeekInfoButton() =>
            _driver.FindElement(HomePageLocators.WeekInfoButton).Click();

        public void ScrollWeekForward() =>
            _driver.FindElement(HomePageLocators.WeekRightArrow).Click();

        public void ScrollWeekBackwards() =>
            _driver.FindElement(HomePageLocators.WeekLeftArrow).Click();

        public void ClickYourRights() =>
            _driver.FindElement(HomePageLocators.EligibilitySectionRoot).Click();

        public void ClickJoiningMaccabiForm() =>
            _driver.FindElement(HomePageLocators.JoiningMaccabiFormCard).Click();

        public void ClickFirstArticle() =>
            _driver.FindElement(HomePageLocators.ArticlesFirstPanel).Click();

        public void ClickThirdArticle() =>
            _driver.FindElement(HomePageLocators.ArticlesThirdCard).Click();

        public void ClickAvatarButton() =>
            _driver.FindElement(HomePageLocators.AvatarButton).Click();

        public void ClickProfilePictureImageUpload() =>
            _driver.FindElement(HomePageLocators.ProfilePictureImageUploadButton).Click();

        public void ClickProfilePictureSelectingGallery() =>
            _driver.FindElement(HomePageLocators.ProfilePictureSelectingGalleryItem).Click();

        public void ClickImageSelectConfirmButton() =>
            _driver.FindElement(HomePageLocators.ImageSelectConfirmButton).Click();

        public void SelectDifferentFetusCount()
        {
            var possibleCounts = new int[] { 1, 2, 3 };

            // Picker exists
            var picker = _driver.FindElement(By.Id("com.ideomobile.maccabipregnancy:id/numberPickerView"));

            // Detect current value (primary: EditText inside picker)
            int currentCount = -1;
            try
            {
                var edit = picker.FindElements(By.XPath(".//android.widget.EditText")).FirstOrDefault();
                if (edit != null && int.TryParse(edit.Text, out var val)) currentCount = val;
            }
            catch { }

            // Secondary: detect selected attribute on child TextViews
            if (currentCount == -1)
            {
                foreach (var c in possibleCounts)
                {
                    var el = picker.FindElements(By.XPath($".//android.widget.TextView[@content-desc='{c}']")).FirstOrDefault();
                    if (el != null)
                    {
                        var sel = (el.GetAttribute("selected") ?? el.GetAttribute("checked") ?? el.GetAttribute("focused") ?? string.Empty).ToLower();
                        if (sel.Contains("true"))
                        {
                            currentCount = c;
                            break;
                        }
                    }
                }
            }

            if (currentCount == -1) currentCount = possibleCounts[0];

            // Pick a random alternative
            var alternatives = possibleCounts.Where(c => c != currentCount).ToArray();
            var rnd = new Random();
            var choice = alternatives[rnd.Next(alternatives.Length)];

            // Click the chosen option inside the picker (or globally as fallback)
            var target = picker.FindElements(By.XPath($".//android.widget.TextView[@content-desc='{choice}']")).FirstOrDefault()
                         ?? _driver.FindElements(By.XPath($"//android.widget.TextView[@content-desc='{choice}']")).FirstOrDefault();
            target?.Click();
        }

        public void ClickProfileSaveButton()
        {
            var saveButton = _driver.FindElement(HomePageLocators.ProfileSaveButton);
            saveButton.Click();
        }

        public void ClickLastCycleDateCalendar() =>
            _driver.FindElement(HomePageLocators.LastCycleDateCalendar).Click();

        public string SelectRandomDate()
        {
            // Find all enabled, clickable days
            var days = _driver.FindElements(By.XPath("//android.view.View[@clickable='true' and @enabled='true']"));
            var today = DateTime.Today.Day;
            var validDays = new List<IWebElement>();
            foreach (var d in days)
            {
                if (int.TryParse(d.Text, out int dayNum) && dayNum < today)
                {
                    validDays.Add(d);
                }
            }
            if (validDays.Count == 0)
            {
                // fallback: select the first available day
                var fallback = days.First();
                var fallbackText = fallback.Text;
                fallback.Click();
                return fallbackText;
            }
            var rand = new Random();
            var selected = validDays[rand.Next(validDays.Count)];
            var selectedText = selected.Text;
            selected.Click();
            return selectedText;
        }

        public void ClickCalendarConfirmButton() =>
            _driver.FindElement(HomePageLocators.CalendarConfirmButton).Click();

        public string GetLastCycleDateText() =>
            _driver.FindElement(HomePageLocators.LastCycleDateCalendar).Text;

        public void ClickChecksFirstIndex() =>
            _driver.FindElement(HomePageLocators.ChecksFirstIndex).Click();

        public void ClickShowMoreChecks() =>
            _driver.FindElement(HomePageLocators.ShowMoreChecks).Click();

        public void ClickChecksFullList() =>
            _driver.FindElement(HomePageLocators.ChecksFullList).Click();

        public bool IsSuggestedChecksHeaderVisible(string expectedText)
        {
            try
            {
                var element = _driver.FindElement(HomePageLocators.SuggestedChecksHeader);
                return element.Displayed && element.Text.Contains(expectedText);
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }


        public void ClickPregnancyBinder() =>
            _driver.FindElement(HomePageLocators.PregnancyBinderButton).Click();

        public void ClickFileAddButton() =>
            _driver.FindElement(HomePageLocators.FloatingActionButton).Click();

        public void ClickMyFilesOption() =>
            _driver.FindElement(HomePageLocators.MyFilesOption).Click();

        public void SelectFirstFile()
        {
            AcceptPermissionsIfPresent();
            var originalWait = _driver.Manage().Timeouts().ImplicitWait;
            try
            {
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);
                var firstImage = By.XPath("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[6]/android.view.View[2]/android.view.View[2]/android.view.View");
                var elements = _driver.FindElements(firstImage);
                if (elements.Count > 0)
                {
                    elements[0].Click();
                }
            }
            finally
            {
                _driver.Manage().Timeouts().ImplicitWait = originalWait;
            }
        }

        public void ClickSaveButton()
        {
            var originalWait = _driver.Manage().Timeouts().ImplicitWait;
            try
            {
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(6);
                var tapped = TryClick(HomePageLocators.SaveButton)
                    || TryClick(HomePageLocators.DocumentsUiDone)
                    || TryClick(HomePageLocators.SystemPositiveButton)
                    || TryClick(By.XPath("//*[contains(@text,'Save') or contains(@text,'שמור') or contains(@text,'שמירה') or contains(@content-desc,'Save')]"));
                if (!tapped)
                {
                    // As a fallback, try common confirm/OK buttons again
                    tapped = TryClick(By.Id("android:id/button1"))
                        || TryClick(By.XPath("//*[contains(@text,'OK') or contains(@text,'אישור') or contains(@text,'סיום') or contains(@text,'Done')]"));
                }
                if (!tapped)
                {
                    // If still not found, try going back once and re-check
                    TryPressBack();
                    _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);
                    tapped = TryClick(HomePageLocators.SaveButton)
                        || TryClick(By.XPath("//*[contains(@text,'Save') or contains(@text,'שמור') or contains(@text,'שמירה') or contains(@content-desc,'Save')]"))
                        || TryClick(HomePageLocators.SystemPositiveButton);
                }
            }
            finally
            {
                _driver.Manage().Timeouts().ImplicitWait = originalWait;
            }
        }

        public void ClickOptionsButton() =>
            _driver.FindElement(HomePageLocators.MoreImageButton).Click();

        public void ClickDeleteButton() =>
            _driver.FindElement(HomePageLocators.DeleteButton).Click();

        public void SelectPregnancyFolderCheckbox() =>
            _driver.FindElement(HomePageLocators.PregnancyFolderCheckbox).Click();

        public void ClickDeleteAction() =>
            _driver.FindElement(HomePageLocators.DeleteActionButton).Click();

        public void ConfirmFileDeletion() =>
            _driver.FindElement(HomePageLocators.ConfirmDeleteButton).Click();

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

        private bool TryClick(By by)
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

        public void ClickPersonalArea() =>
            _driver.FindElement(HomePageLocators.PersonalAreaButton).Click();

        public int GetFetusCount()
        {
            System.Threading.Thread.Sleep(500);

            try
            {
                // Try to find EditText fields on the profile page
                var editTexts = _driver.FindElements(By.XPath("//android.widget.EditText"));
                foreach (var editText in editTexts)
                {
                    var text = editText.Text;
                    if (!string.IsNullOrEmpty(text) && int.TryParse(text, out int num) && num >= 1 && num <= 3)
                    {
                        return num;
                    }
                }

                // Try the number picker if it's visible
                var picker = _driver.FindElement(By.Id("com.ideomobile.maccabipregnancy:id/numberPickerView"));
                var pickerEdit = picker.FindElements(By.XPath(".//android.widget.EditText")).FirstOrDefault();
                if (pickerEdit != null && int.TryParse(pickerEdit.Text, out int count))
                {
                    return count;
                }
            }
            catch { }

            try
            {
                // Fallback: search all TextViews for numbers 1-3
                var allElements = _driver.FindElements(By.XPath("//*"));
                foreach (var element in allElements)
                {
                    try
                    {
                        var text = element.Text;
                        if (text == "1" || text == "2" || text == "3")
                        {
                            var className = element.GetAttribute("className") ?? "";
                            if (className.Contains("EditText"))
                            {
                                return int.Parse(text);
                            }
                        }
                    }
                    catch { }
                }
            }
            catch { }

            return -1;
        }

        public void GoBack()
        {
            TryPressBack();
        }

        public void NavigateToPersonalMedicalFile()
        {
            _driver.FindElement(HomePageLocators.PersonalMedicalFileButton).Click();
        }
    }
}
