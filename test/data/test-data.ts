export interface RegistrationData {
    name: string;
    fetusCount: number;
    dateOptions?: {
        useRandomDate: boolean;
        specificDate?: string;
        dateRange?: {
            minDaysAgo: number;
            maxDaysAgo: number;
        };
    };
}

export interface TestUser {
    id: string;
    registrationData: RegistrationData;
    expectedResults: {
        shouldReachDashboard: boolean;
        expectedScreens: string[];
    };
}

export const testUsers: TestUser[] = [
	{
		id: "Michael_Registration_Test",  // ← THIS BECOMES PART OF TEST TITLE
		registrationData: {
			name: "מיכאל קורולנקו",
			fetusCount: 1,
			dateOptions: {
				useRandomDate: true,
				dateRange: {
					minDaysAgo: 14,
					maxDaysAgo: 104
				}
			}
		},
		expectedResults: {
			shouldReachDashboard: true,
			expectedScreens: ["splash", "skip", "name", "date", "fetus", "dashboard"]
		}
	},
	{
		id: "Sarah_Twin_Pregnancy_Test",  // ← THIS BECOMES PART OF TEST TITLE
		registrationData: {
			name: "שרה כהן",
			fetusCount: 2,
			dateOptions: {
				useRandomDate: true,
				dateRange: {
					minDaysAgo: 20,
					maxDaysAgo: 60
				}
			}
		},
		expectedResults: {
			shouldReachDashboard: true,
			expectedScreens: ["splash", "skip", "name", "date", "fetus", "dashboard"]
		}
	}
];

export const appConstants = {
	splashScreenMaxAttempts: 5,     // Reduced from 10
	skipButtonMaxAttempts: 3,       // Reduced from 5
	defaultPauseTime: 1000,         // Reduced from 2000
	longPauseTime: 1500,            // Reduced from 3000
	androidBackButton: 4,
	hebrewLocale: "he-IL"
};
