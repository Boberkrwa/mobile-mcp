using NUnit.Framework;
using PregnancyApp.Helpers;

namespace PregnancyApp.Tests
{
    [SetUpFixture]
    public class SuiteSetup
    {
        private DriverManager? _driverManager;

        [OneTimeSetUp]
        public void BeforeAll()
        {
            _driverManager = new DriverManager();
            _driverManager.InitializeDriver();
        }

        [OneTimeTearDown]
        public void AfterAll()
        {
            _driverManager?.QuitDriver();
            _driverManager = null;
        }
    }
}
