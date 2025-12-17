using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using PregnancyApp.Config;

namespace PregnancyApp.Helpers
{
    public class DriverManager
    {
        private AndroidDriver? driver;
        public static AndroidDriver? SharedDriver { get; private set; }

        public AndroidDriver InitializeDriver()
        {
            var appiumOptions = new AppiumOptions();
            appiumOptions.PlatformName = AppConfig.PlatformName;
            appiumOptions.AutomationName = AppConfig.AutomationName;
            appiumOptions.DeviceName = AppConfig.DeviceName;
            appiumOptions.AddAdditionalAppiumOption("appPackage", AppConfig.AppPackage);
            appiumOptions.AddAdditionalAppiumOption("appActivity", AppConfig.AppActivity);
            appiumOptions.AddAdditionalAppiumOption("appWaitPackage", AppConfig.AppPackage);
            appiumOptions.AddAdditionalAppiumOption("appWaitActivity", "*");
            appiumOptions.AddAdditionalAppiumOption("noReset", true);
            appiumOptions.AddAdditionalAppiumOption("fullReset", false);
            appiumOptions.AddAdditionalAppiumOption("autoGrantPermissions", true);
            appiumOptions.AddAdditionalAppiumOption("appWaitForLaunch", true);
            driver = new AndroidDriver(new Uri(AppConfig.AppiumServerUrl), appiumOptions,
                TimeSpan.FromSeconds(AppConfig.CommandTimeout));

            SharedDriver = driver;
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(AppConfig.ImplicitWaitTimeout);

            return driver;
        }

        public void QuitDriver()
        {
            if (driver != null)
            {
                driver.Quit();
                driver = null;
                SharedDriver = null;
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

        public static AndroidDriver GetSharedDriver()
        {
            if (SharedDriver == null)
            {
                throw new InvalidOperationException("Shared driver is not initialized. Ensure OneTimeSetUp has run.");
            }
            return SharedDriver;
        }
    }
}
