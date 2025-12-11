namespace PregnancyApp.Config
{
    public class AppConfig
    {
        // Appium Server
        public const string AppiumServerUrl = "http://localhost:4723";

        // App Details
        public const string AppPackage = "com.ideomobile.maccabipregnancy";
        public const string AppActivity = ".ui.splash.view.PASplashActivity";

        // Device Settings
        public const string PlatformName = "Android";
        public const string AutomationName = "UiAutomator2";
        public const string DeviceName = "Android Device";

        // Timeouts (in seconds)
        public const int ImplicitWaitTimeout = 10;
        public const int CommandTimeout = 120;
    }
}
