using OpenQA.Selenium;
using OpenQA.Selenium.Appium;

namespace PregnancyApp.Helpers
{
    public static class HomePageLocators
    {
        public static readonly By PersonalAreaButton = By.Id("com.ideomobile.maccabipregnancy:id/topPanel");
        public static readonly By IdInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditText");
        public static readonly By PasswordInput = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditTextPassword");
        public static readonly By LoginButton = By.Id("com.ideomobile.maccabipregnancy:id/enterButton");
        public static readonly By YourBagButton = By.XPath("(//android.widget.ImageView[@resource-id=\"com.ideomobile.maccabipregnancy:id/ivCubeImage\"])[1]");
        public static readonly By YourBagFirstIndex = By.XPath("//androidx.recyclerview.widget.RecyclerView[@resource-id=\"com.ideomobile.maccabipregnancy:id/rvMyListTab\"]/android.widget.LinearLayout[1]");
        public static readonly By YourList = By.Id("com.ideomobile.maccabipregnancy:id/btnMyList");
        public static readonly By WeekInfoButton = By.Id("com.ideomobile.maccabipregnancy:id/weekInfoButton");
        public static readonly By WeekRightArrow = By.Id("com.ideomobile.maccabipregnancy:id/rightArrow");
        public static readonly By WeekLeftArrow = By.Id("com.ideomobile.maccabipregnancy:id/leftArrow");
        public static readonly By YourRights = By.XPath("(//android.widget.ImageView[@resource-id=\"com.ideomobile.maccabipregnancy:id/arrow\"])[1]");
        public static readonly By JoiningMaccabiFormCard = By.XPath("//android.widget.FrameLayout[@resource-id=\"com.ideomobile.maccabipregnancy:id/cvLead\"]/android.view.ViewGroup");
        public static readonly By FetusMovementButton = By.XPath("//android.widget.LinearLayout[@content-desc=\"לחצן מעקב תנועות עובר\"]/android.widget.FrameLayout/android.widget.ImageView[1]");
        public static readonly By StartFetusMovement = By.XPath("//android.widget.FrameLayout[@content-desc=\"לחצן התחילי מעקב\"]/android.widget.FrameLayout/android.widget.ImageView");

        public static readonly By FinishTrackingButton = By.Id("com.ideomobile.maccabipregnancy:id/successFinishButton");
        public static readonly By ContractionIcon = By.XPath("//android.widget.FrameLayout[@resource-id=\"com.ideomobile.maccabipregnancy:id/flContractionIcon\"]/android.widget.ImageView[1]");
        public static readonly By AnyImageView = By.XPath("//android.widget.ImageView");
        public static readonly By ResetContractionsButton = By.Id("com.ideomobile.maccabipregnancy:id/tvReset");
        public static readonly By PregnancyBinderButton = By.XPath("//android.widget.LinearLayout[@content-desc=\"לחצן קלסר ההריון שלך\"]/android.widget.FrameLayout/android.widget.ImageView[1]");
        public static readonly By FloatingActionButton = By.Id("com.ideomobile.maccabipregnancy:id/floatingActionButton");
        public static readonly By MyFilesOption = By.XPath("//android.widget.TextView[@resource-id=\"com.ideomobile.maccabipregnancy:id/categoryNameTextView\" and @text=\"הקבצים שלי\"]");
        public static readonly By SaveButton = By.Id("com.ideomobile.maccabipregnancy:id/bSaveButton");
        public static readonly By ProfileSaveButton = By.Id("com.ideomobile.maccabipregnancy:id/bSaveButton");
        public static readonly By MoreImageButton = By.Id("com.ideomobile.maccabipregnancy:id/moreImageButton");
        public static readonly By DeleteButton = By.XPath("//android.widget.TextView[@resource-id=\"android:id/title\" and @text=\"מחיקה\"]");
        public static readonly By ArticlesFirstPanel = By.XPath("(//android.widget.RelativeLayout[@resource-id=\"com.ideomobile.maccabipregnancy:id/testPanel\"])[1]");
        public static readonly By ArticlesThirdCard = By.XPath("(//android.view.ViewGroup[@resource-id=\"com.ideomobile.maccabipregnancy:id/clRoot\"])[3]");

        public static readonly By AvatarButton = By.Id("com.ideomobile.maccabipregnancy:id/avatar");

        public static readonly By ProfilePictureImageUploadButton = By.Id("com.ideomobile.maccabipregnancy:id/profilePictureImageView");

        public static readonly By ProfilePictureSelectingGalleryItem = MobileBy.XPath("//android.widget.ListView[@resource-id='com.ideomobile.maccabipregnancy:id/lv_items']/android.view.ViewGroup[1]");

        public static readonly By ImageSelectConfirmButton = By.Id("com.ideomobile.maccabipregnancy:id/buttonSubmitCrop");

        public static readonly By LastCycleDateCalendar = By.Id("com.ideomobile.maccabipregnancy:id/textInputEditText");

        public static readonly By CalendarFirstAvailableDay = MobileBy.XPath("(//android.view.View[@clickable='true' and @enabled='true'])[1]");

        public static readonly By CalendarConfirmButton = By.Id("android:id/button1");

        public static readonly By ChecksFirstIndex = MobileBy.XPath("(//android.widget.RelativeLayout[@resource-id='com.ideomobile.maccabipregnancy:id/testPanel'])[1]");

        public static readonly By ShowMoreChecks = MobileBy.Id("com.ideomobile.maccabipregnancy:id/showMoreItemsRoot");

        public static readonly By ChecksFullList = MobileBy.Id("com.ideomobile.maccabipregnancy:id/allTestsTextView");

        public static readonly By SuggestedChecksHeader = MobileBy.Id("com.ideomobile.maccabipregnancy:id/tvHeader");
        public static readonly By PregnancyFolderCheckbox = By.Id("com.ideomobile.maccabipregnancy:id/cbPregnancyFolder");
        public static readonly By DeleteActionButton = By.Id("com.ideomobile.maccabipregnancy:id/actionTextView");
        public static readonly By ConfirmDeleteButton = By.Id("com.ideomobile.maccabipregnancy:id/btn_positive");
        public static readonly By PermissionAllowButton = By.Id("com.android.permissioncontroller:id/permission_allow_button");
        public static readonly By SystemPositiveButton = By.Id("android:id/button1");
        public static readonly By DocumentsUiDone = By.Id("com.android.documentsui:id/action_menu_done");
        public static readonly By YourFileButton = By.XPath("//android.widget.LinearLayout[@content-desc=\"לחצן התיק הרפואי שלך\"]/android.widget.FrameLayout/android.widget.ImageView[1]");
    }
}
