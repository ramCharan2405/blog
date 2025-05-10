import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { appwriteService } from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      appwriteService.getPost(slug)
        .then((post) => {
          if (post) {
            setPost(post);
          } else {
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          navigate("/");
        })
        .finally(() => setLoading(false));
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  const renderContent = (content) => {
    // Check if content contains HTML tags
    if (/<[^>]*>/g.test(content)) {
      return parse(content);
    }
    // Otherwise render as Markdown
    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  if (loading) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full py-12">
        <Container>
          {loading ? (
            <div className="w-full bg-white rounded-2xl p-8 animate-pulse shadow-sm">
              <div className="h-64 bg-gray-100 rounded-xl mb-6"></div>
              <div className="h-8 bg-gray-100 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
                {post?.featuredImage ? (
                  <img
                    src={appwriteService.getFilePreview(post.featuredImage)}
                    alt={post?.title}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">{post?.title}</h1>
                    <p className="text-gray-500">
                      {new Date(post?.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isAuthor && (
                    <div className="flex gap-4">
                      <Link to={`/edit-post/${post?.$id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-colors duration-300 font-medium">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={deletePost}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-colors duration-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-h1:mb-6 prose-h2:mb-5 prose-h3:mb-4 prose-h4:mb-3 prose-h5:mb-2 prose-h6:mb-2">
                  {renderContent(post?.content)}
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
