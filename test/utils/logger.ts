export class Logger {
    private context: string;
    private static isDebugMode: boolean = process.env.DEBUG === 'true';

    constructor(context: string) {
        this.context = context;
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private formatMessage(level: string, message: string, data?: any): string {
        const timestamp = this.getTimestamp();
        const dataStr = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : '';
        return `[${timestamp}] [${level}] [${this.context}] ${message}${dataStr}`;
    }

    info(message: string, data?: any): void {
        console.log(`ℹ️ ${this.formatMessage('INFO', message, data)}`);
    }

    success(message: string, data?: any): void {
        console.log(`✅ ${this.formatMessage('SUCCESS', message, data)}`);
    }

    warning(message: string, data?: any): void {
        console.warn(`⚠️ ${this.formatMessage('WARNING', message, data)}`);
    }

    error(message: string, error?: any): void {
        const errorData = error ? { 
            message: error.message, 
            stack: error.stack 
        } : undefined;
        console.error(`❌ ${this.formatMessage('ERROR', message, errorData)}`);
    }

    debug(message: string, data?: any): void {
        if (Logger.isDebugMode) {
            console.log(`🔍 ${this.formatMessage('DEBUG', message, data)}`);
        }
    }

    step(stepNumber: number, description: string): void {
        console.log(`🔄 Step ${stepNumber}: ${description}`);
    }

    action(description: string): void {
        console.log(`🎯 ${description}`);
    }

    static setDebugMode(enabled: boolean): void {
        Logger.isDebugMode = enabled;
    }

    static enableDebug(): void {
        Logger.setDebugMode(true);
    }

    static disableDebug(): void {
        Logger.setDebugMode(false);
    }
}
