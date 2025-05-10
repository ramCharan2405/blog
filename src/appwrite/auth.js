import { Account, ID } from "appwrite";
import client from "./client";

class AuthService {
    account;

    constructor() {
        try {
            this.account = new Account(client);
        } catch (error) {
            throw error;
        }
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                const session = await this.account.createEmailSession(email, password);
                return userAccount;
            }
            throw new Error("Failed to create account");
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // First check if user is already logged in
            try {
                const currentUser = await this.account.get();
                if (currentUser) {
                    return currentUser;
                }
            } catch (error) {
                // If get() fails, user is not logged in, continue with login
            }

            // Create new session
            const session = await this.account.createEmailSession(email, password);
            const userData = await this.account.get();
            return userData;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
            return true;
        } catch (error) {
            throw error;
        }
    }

    async isAuthenticated() {
        try {
            const user = await this.account.get();
            return !!user;
        } catch (error) {
            return false;
        }
    }
}

const authService = new AuthService();

export { authService };
