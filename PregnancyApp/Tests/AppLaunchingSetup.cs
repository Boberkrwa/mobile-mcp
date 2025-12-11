using NUnit.Framework;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests
{
    // Namespace-level suite setup/teardown moved to dedicated file
    [SetUpFixture]
    public class AppLaunchingSetup
    {
        private DriverManager? driverManager;

        [OneTimeSetUp]
        public void Setup()
        {
            driverManager = new DriverManager();
            driverManager.InitializeDriver();
            Console.WriteLine("Maccabi Pregnancy app launched");
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            driverManager?.QuitDriver();
            Console.WriteLine("App closed");
            driverManager = null;
        }
    }
}
