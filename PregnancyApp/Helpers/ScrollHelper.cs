using NUnit.Framework;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PregnancyApp.Helpers
{
    public static class ScrollHelper
    {
        public static void ScrollAction(AndroidDriver driver, int attempts = 5)
        {
            try
            {
                var size = driver.Manage().Window.Size;
                int centerX = size.Width / 2;
                int startY = (int)(size.Height * 0.75);
                int endY = (int)(size.Height * 0.25);

                TestContext.Progress.WriteLine($"Dragging from centerX={centerX} startY={startY} to endY={endY}");

                int safety = attempts;
                for (int i = 0; i < safety; i++)
                {
                    driver.ExecuteScript("mobile: dragGesture", new Dictionary<string, object>
                    {
                        { "startX", centerX },
                        { "startY", startY },
                        { "endX", centerX },
                        { "endY", endY },
                        { "speed", 2000 }
                    });
                    TestContext.Progress.WriteLine($"drag gesture step={i}");
                    System.Threading.Thread.Sleep(150);
                }
            }
            catch (Exception ex)
            {
                TestContext.Progress.WriteLine($"Scroll failed: {ex.Message}");
            }
        }

        public static void ScrollToTop(AndroidDriver driver, int attempts = 5)
        {
            try
            {
                var size = driver.Manage().Window.Size;
                int centerX = size.Width / 2;
                int startY = (int)(size.Height * 0.25);
                int endY = (int)(size.Height * 0.75);

                TestContext.Progress.WriteLine($"Dragging from centerX={centerX} startY={startY} to endY={endY}");

                int safety = attempts;
                for (int i = 0; i < safety; i++)
                {
                    driver.ExecuteScript("mobile: dragGesture", new Dictionary<string, object>
                    {
                        { "startX", centerX },
                        { "startY", startY },
                        { "endX", centerX },
                        { "endY", endY },
                        { "speed", 2000 }
                    });
                    TestContext.Progress.WriteLine($"drag gesture step={i}");
                    System.Threading.Thread.Sleep(150);
                }
            }
            catch (Exception ex)
            {
                TestContext.Progress.WriteLine($"Scroll failed: {ex.Message}");
            }
        }
    }
}
