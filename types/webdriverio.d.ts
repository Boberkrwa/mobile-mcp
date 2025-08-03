declare module "webdriverio" {
    interface Capabilities {
        platformName?: string;
        "appium:deviceName"?: string;
        "appium:app"?: string;
        "appium:appPackage"?: string;
        "appium:appActivity"?: string;
        "appium:automationName"?: string;
        "appium:noReset"?: boolean;
    }

    export interface RemoteOptions {
        hostname?: string;
        port?: number;
        path?: string;
        logLevel?: string;
        capabilities: Capabilities;
    }

    export function remote(options: RemoteOptions): Promise<any>;
}
