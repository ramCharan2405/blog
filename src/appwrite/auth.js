
import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }


    async createAccount({ email, password, name }) {
        try {
         
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
         
                const loginResult = await this.login({ email, password });
                console.log("Login result:", loginResult); 
                return loginResult;
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error("Error in creating account:", error);
            throw error;  
        }
    }

    async login({ email, password }) {
        try {
            
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;  
        }
    }

    
    async getCurrentUser() {
        try {
          
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service:: getCurrentUser :: error", error);
            return null;  
        }
    }

    async logout() {
        try {
           
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service:: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
