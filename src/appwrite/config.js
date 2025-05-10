import { Client, Account, Databases, Storage, ID, Query } from "appwrite";
import conf from "../conf/conf";

class AppwriteService {
    client = new Client();
    databases;
    bucket;
    account;

    constructor() {
        console.log("Initializing Appwrite with config:", {
            url: conf.appwriteUrl,
            projectId: conf.appwriteProjectId,
            databaseId: conf.appwriteDatabaseId,
            collectionId: conf.appwriteCollectionId,
            bucketId: conf.appwriteBucketId
        });

        if (!conf.appwriteUrl || !conf.appwriteProjectId) {
            console.error("Missing Appwrite configuration:", {
                url: conf.appwriteUrl,
                projectId: conf.appwriteProjectId
            });
            throw new Error("Appwrite configuration is missing. Please check your .env file.");
        }

        try {
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);

            this.databases = new Databases(this.client);
            this.bucket = new Storage(this.client);
            this.account = new Account(this.client);
            console.log("Appwrite client initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Appwrite client:", error);
            throw error;
        }
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            if (!conf.appwriteDatabaseId || !conf.appwriteCollectionId) {
                throw new Error("Database or Collection ID is missing");
            }
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            );
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            if (!conf.appwriteDatabaseId || !conf.appwriteCollectionId) {
                throw new Error("Database or Collection ID is missing");
            }
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            if (!conf.appwriteDatabaseId || !conf.appwriteCollectionId) {
                throw new Error("Database or Collection ID is missing");
            }
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", error);
            throw error;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            throw error;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            console.log("Attempting to fetch posts with config:", {
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollectionId
            });

            if (!conf.appwriteDatabaseId || !conf.appwriteCollectionId) {
                throw new Error("Database or Collection ID is missing");
            }

            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );

            console.log("Successfully fetched posts:", response);
            return response;
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", error);
            throw error;
        }
    }

    getFilePreview(fileId) {
        try {
            if (!fileId) {
                console.log("getFilePreview: No fileId provided");
                return null;
            }
            console.log("getFilePreview: Generating preview for fileId:", fileId);
            const fileUrl = this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId
            );
            console.log("getFilePreview: Generated file URL:", fileUrl);
            return fileUrl;
        } catch (error) {
            console.error("Appwrite service :: getFilePreview :: error", error);
            return null;
        }
    }
}

const appwriteService = new AppwriteService();

export { appwriteService };