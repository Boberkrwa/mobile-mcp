using NUnit.Framework;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests
{
    // Namespace-level suite setup and teardown in one file
    [SetUpFixture]
    public class AppLaunching
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

    // Minimal test to trigger discovery/run
    public class Smoke
    {
        [Test]
        public void Runs()
        {
            Assert.Pass();
        }
    }
}
