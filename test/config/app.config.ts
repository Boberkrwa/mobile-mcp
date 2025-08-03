export interface AppConfig {
    deviceId: string;
    appPackage: string;
    appActivity: string;
    appiumServer: {
        hostname: string;
        port: number;
        path: string;
    };
    timeouts: {
        implicit: number;
        explicit: number;
        pageLoad: number;
    };
    capabilities: {
        platformName: string;
        automationName: string;
        noReset: boolean;
    };
}

export const maccabiConfig: AppConfig = {
    deviceId: 'b7a325f6',
    appPackage: 'com.ideomobile.maccabipregnancy',
    appActivity: '.ui.splash.view.PASplashActivity',
    appiumServer: {
        hostname: 'localhost',
        port: 4723,
        path: '/'
    },
    timeouts: {
        implicit: 10000,
        explicit: 30000,
        pageLoad: 60000
    },
    capabilities: {
        platformName: 'Android',
        automationName: 'UiAutomator2',
        noReset: true
    }
};
