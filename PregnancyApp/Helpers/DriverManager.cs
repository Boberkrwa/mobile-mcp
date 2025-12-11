using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Config;

namespace PregnancyApp.Helpers
{
    public class DriverManager
    {
        private AndroidDriver? driver;

        public AndroidDriver InitializeDriver()
        {
            var appiumOptions = new AppiumOptions();

            // Platform settings
            appiumOptions.PlatformName = AppConfig.PlatformName;
            appiumOptions.AutomationName = AppConfig.AutomationName;
            appiumOptions.DeviceName = AppConfig.DeviceName;

            // App settings
            appiumOptions.AddAdditionalAppiumOption("appPackage", AppConfig.AppPackage);
            appiumOptions.AddAdditionalAppiumOption("appActivity", AppConfig.AppActivity);

            // Additional settings
            appiumOptions.AddAdditionalAppiumOption("noReset", true);
            appiumOptions.AddAdditionalAppiumOption("fullReset", false);

            // Initialize driver
            driver = new AndroidDriver(new Uri(AppConfig.AppiumServerUrl), appiumOptions,
                TimeSpan.FromSeconds(AppConfig.CommandTimeout));

            // Set implicit wait
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(AppConfig.ImplicitWaitTimeout);

            return driver;
        }

        public void QuitDriver()
        {
            if (driver != null)
            {
                driver.Quit();
                driver = null;
            }
        }

        public AndroidDriver GetDriver()
        {
            if (driver == null)
            {
                throw new InvalidOperationException("Driver is not initialized. Call InitializeDriver() first.");
            }
            return driver;
        }
    }
}
