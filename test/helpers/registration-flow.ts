import { DriverManager } from '../helpers/driver-manager';
import { Logger } from '../utils/logger';
import { SplashPage } from '../pages/splash.page';
import { SkipPage } from '../pages/skip.page';
import { NameInputPage } from '../pages/name-input.page';
import { DateInputPage } from '../pages/date-input.page';
import { FetusCountPage } from '../pages/fetus-count.page';
import { DashboardPage } from '../pages/dashboard.page';
import { RegistrationData } from '../data/test-data';

export class MaccabiRegistrationFlow {
    private driverManager: DriverManager;
    private logger: Logger;
    
    // Page objects
    private splashPage: SplashPage;
    private skipPage: SkipPage;
    private nameInputPage: NameInputPage;
    private dateInputPage: DateInputPage;
    private fetusCountPage: FetusCountPage;
    private dashboardPage: DashboardPage;

    constructor(driverManager: DriverManager) {
        this.driverManager = driverManager;
        this.logger = new Logger('RegistrationFlow');
        
        // Initialize page objects
        this.splashPage = new SplashPage(driverManager);
        this.skipPage = new SkipPage(driverManager);
        this.nameInputPage = new NameInputPage(driverManager);
        this.dateInputPage = new DateInputPage(driverManager);
        this.fetusCountPage = new FetusCountPage(driverManager);
        this.dashboardPage = new DashboardPage(driverManager);
    }

    async executeCompleteRegistration(registrationData: RegistrationData): Promise<boolean> {
        try {
            this.logger.info('🚀 Starting Maccabi app registration flow...');
            
            // Step 1: Handle splash screen
            this.logger.step(1, 'Handling splash screen');
            const splashHandled = await this.handleSplashScreen();
            if (!splashHandled) {
                this.logger.warning('Splash screen handling had issues, but continuing...');
            }
            
            // Step 2: Handle skip button
            this.logger.step(2, 'Handling skip button');
            const skipHandled = await this.handleSkipButton();
            if (!skipHandled) {
                this.logger.warning('Skip button not found, but continuing...');
            }
            
            // Step 3: Enter name
            this.logger.step(3, 'Entering user name');
            const nameEntered = await this.handleNameInput(registrationData.name);
            if (!nameEntered) {
                this.logger.error('Failed to enter name - registration cannot continue');
                return false;
            }
            
            // Step 4: Handle date input
            this.logger.step(4, 'Handling date input');
            const dateHandled = await this.handleDateInput();
            if (!dateHandled) {
                this.logger.error('Failed to handle date input - registration cannot continue');
                return false;
            }
            
            // Step 5: Select fetus count
            this.logger.step(5, 'Selecting fetus count');
            const fetusSelected = await this.handleFetusCount(registrationData.fetusCount);
            if (!fetusSelected) {
                this.logger.warning('Fetus count selection had issues, but continuing...');
            }
            
            // Step 6: Verify dashboard
            this.logger.step(6, 'Verifying successful registration');
            const registrationSuccessful = await this.verifyRegistrationSuccess();
            
            if (registrationSuccessful) {
                this.logger.success('🎉 Complete registration flow executed successfully!');
                return true;
            } else {
                this.logger.error('❌ Registration flow completed but verification failed');
                return false;
            }
            
        } catch (error) {
            this.logger.error('❌ Registration flow failed with error', error);
            return false;
        }
    }

    private async handleSplashScreen(): Promise<boolean> {
        try {
            await this.splashPage.waitForPageToLoad();
            return await this.splashPage.waitForSplashToDisappear();
        } catch (error) {
            this.logger.error('Error handling splash screen', error);
            return false;
        }
    }

    private async handleSkipButton(): Promise<boolean> {
        try {
            await this.skipPage.waitForPageToLoad();
            return await this.skipPage.findAndClickSkipButton();
        } catch (error) {
            this.logger.error('Error handling skip button', error);
            return false;
        }
    }

    private async handleNameInput(name: string): Promise<boolean> {
        try {
            await this.nameInputPage.waitForPageToLoad();
            return await this.nameInputPage.completeNameInput(name);
        } catch (error) {
            this.logger.error('Error handling name input', error);
            return false;
        }
    }

    private async handleDateInput(): Promise<boolean> {
        try {
            await this.dateInputPage.waitForPageToLoad();
            return await this.dateInputPage.completeDateInput();
        } catch (error) {
            this.logger.error('Error handling date input', error);
            return false;
        }
    }

    private async handleFetusCount(count: number): Promise<boolean> {
        try {
            await this.fetusCountPage.waitForPageToLoad();
            return await this.fetusCountPage.completeFetusSelection(count);
        } catch (error) {
            this.logger.error('Error handling fetus count', error);
            return false;
        }
    }

    private async verifyRegistrationSuccess(): Promise<boolean> {
        try {
            await this.dashboardPage.waitForPageToLoad();
            return await this.dashboardPage.verifySuccessfulRegistration();
        } catch (error) {
            this.logger.error('Error verifying registration success', error);
            return false;
        }
    }

    async getCurrentPackage(): Promise<string> {
        return await this.driverManager.getCurrentPackage();
    }
}
