using NUnit.Framework;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests
{
    public class AppLaunching
    {
        protected DriverManager driverManager = null!;

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
        }
    }
}
