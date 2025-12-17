using NUnit.Framework;
using PregnancyApp.Helpers;
using System.Diagnostics;

namespace PregnancyApp.Tests
{
    [SetUpFixture]
    public class AppLaunchingSetup
    {
        private DriverManager? driverManager;
        private static int startupLogged;

        [OneTimeSetUp]
        public void Setup()
        {
            driverManager = new DriverManager();
            driverManager.InitializeDriver();
            var driver = driverManager.GetDriver();
            driver.ActivateApp(PregnancyApp.Config.AppConfig.AppPackage);
            if (Interlocked.Exchange(ref startupLogged, 1) == 0)
            {
                TestContext.Progress.WriteLine("Maccabi Pregnancy app launched");
            }
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            driverManager?.QuitDriver();
            KillAppProcess();
        }

        private void KillAppProcess()
        {
            try
            {
                var appPackage = PregnancyApp.Config.AppConfig.AppPackage;

                // Use ADB to force-stop the app
                var processInfo = new ProcessStartInfo
                {
                    FileName = "adb",
                    Arguments = $"shell am force-stop {appPackage}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(processInfo))
                {
                    process?.WaitForExit(5000);
                }

                TestContext.Progress.WriteLine($"App {appPackage} force-stopped");
            }
            catch (Exception ex)
            {
                TestContext.Progress.WriteLine($"Error killing app process: {ex.Message}");
            }
        }
    }
}
