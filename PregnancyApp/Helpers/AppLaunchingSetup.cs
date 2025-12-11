using NUnit.Framework;
using PregnancyApp.Helpers;

// Important: Keep the namespace as PregnancyApp.Tests so the SetUpFixture
// applies to the test suite, even though the file lives in Helpers.
namespace PregnancyApp.Tests
{
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
