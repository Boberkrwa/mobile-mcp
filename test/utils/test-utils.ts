export class TestUtils {
	/**
     * Generate a random date string in DD/MM/YYYY format
     */
	static generateRandomDate(): string {
		const day = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
		const month = Math.floor(Math.random() * 12) + 1; // 1-12
		const year = new Date().getFullYear();

		return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
	}

	/**
     * Wait with a custom message
     */
	static async waitWithMessage(ms: number, message: string): Promise<void> {
		console.log(`⏳ ${message} (${ms}ms)`);
		await new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
     * Safely get text from an element
     */
	static async safeGetText(element: any): Promise<string> {
		try {
			return await element.getText();
		} catch (error) {
			return "";
		}
	}

	/**
     * Safely get attribute from an element
     */
	static async safeGetAttribute(element: any, attribute: string): Promise<string> {
		try {
			return await element.getAttribute(attribute) || "";
		} catch (error) {
			return "";
		}
	}

	/**
     * Check if element exists and is interactable
     */
	static async isElementInteractable(element: any): Promise<boolean> {
		try {
			const exists = await element.isExisting();
			if (!exists) {return false;}

			const enabled = await element.isEnabled();
			const clickable = await element.isClickable();

			return enabled && clickable;
		} catch (error) {
			return false;
		}
	}

	/**
     * Log test step with timestamp
     */
	static logStep(step: string, status: "START" | "SUCCESS" | "FAIL" | "INFO" = "INFO"): void {
		const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
		const icons = {
			START: "🚀",
			SUCCESS: "✅",
			FAIL: "❌",
			INFO: "ℹ️"
		};

		console.log(`[${timestamp}] ${icons[status]} ${step}`);
	}

	/**
     * Retry an operation with exponential backoff
     */
	static async retryOperation<T>(
		operation: () => Promise<T>,
		maxRetries: number = 3,
		baseDelay: number = 1000
	): Promise<T> {
		let lastError: Error;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error as Error;

				if (attempt === maxRetries) {
					throw lastError;
				}

				const delay = baseDelay * Math.pow(2, attempt - 1);
				this.logStep(`Retry attempt ${attempt} failed, waiting ${delay}ms...`, "INFO");
				await this.waitWithMessage(delay, `Retrying operation`);
			}
		}

		throw lastError!;
	}
}
