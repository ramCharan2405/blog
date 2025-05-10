import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

class AuthService {
    client;
    account;

    constructor() {
        try {
            // Initialize the client with the latest configuration
            this.client = new Client()
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);

            // Initialize the account service
            this.account = new Account(this.client);

            console.log("Auth service initialized with:", {
                endpoint: conf.appwriteUrl,
                projectId: conf.appwriteProjectId
            });
        } catch (error) {
            console.error("Failed to initialize auth service:", error);
            throw error;
        }
    }

    async createAccount({ email, password, name }) {
        try {
            console.log("Creating account for:", email);

            // Create the account with the latest method
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                console.log("Account created successfully:", userAccount);

                // Create session after account creation using the latest method
                try {
                    const session = await this.account.createEmailPasswordSession(email, password);
                    console.log("Session created after signup:", session);

                    if (session) {
                        const userData = await this.account.get();
                        console.log("User data after signup:", userData);
                        return userData;
                    }
                } catch (sessionError) {
                    console.error("Failed to create session after signup:", sessionError);
                    throw new Error("Account created but failed to create session");
                }
            }
            throw new Error("Failed to create account");
        } catch (error) {
            console.error("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            console.log("Attempting login for:", email);

            // First check if there's an active session
            try {
                const currentSession = await this.account.getSession('current');
                if (currentSession) {
                    console.log("Found existing session, logging out first");
                    await this.account.deleteSession('current');
                }
            } catch (sessionError) {
                console.log("No active session found, proceeding with login");
            }

            // Now create new session
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log("Session created during login:", session);

            if (session) {
                const userData = await this.account.get();
                console.log("User data after login:", userData);
                return userData;
            }
            throw new Error("Failed to create session");
        } catch (error) {
            console.error("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // First try to get the current session
            try {
                const session = await this.account.getSession('current');
                console.log("Current session found:", session);
            } catch (sessionError) {
                console.log("No active session found:", sessionError.message);
                return null;
            }

            // If we have a session, get the user data
            const user = await this.account.get();
            console.log("Current user data:", user);
            return user;
        } catch (error) {
            console.log("Failed to get user data:", error.message);
            return null;
        }
    }

    async logout() {
        try {
            // Try to get the current session first
            try {
                const session = await this.account.getSession('current');
                if (session) {
                    await this.account.deleteSession('current');
                    console.log("Logged out successfully");
                } else {
                    console.log("No active session to logout from");
                }
            } catch (sessionError) {
                console.log("No session found during logout:", sessionError.message);
            }
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
            throw error;
        }
    }

    // Helper method to check if user is authenticated
    async isAuthenticated() {
        try {
            const session = await this.account.getSession('current');
            console.log("Authentication check - Session:", session);
            return !!session;
        } catch (error) {
            console.log("Authentication check failed:", error.message);
            return false;
        }
    }
}

// Create a single instance
const authService = new AuthService();

export { authService };
