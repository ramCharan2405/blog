import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appwriteService } from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    }).catch((error) => {
      console.error("Error fetching posts:", error);
      setError(error.message || "Failed to load posts. Please try again later.");
    });
  }, []);

  if (error) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold text-red-400">
                {error}
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Please check your Appwrite configuration and make sure you're connected to the internet.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold text-gray-100">
                {authStatus ? "No posts found" : "Login to read posts"}
              </h1>
              {!authStatus && (
                <p className="text-gray-400 mt-2">
                  Please login to view and create posts
                </p>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Blog</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
