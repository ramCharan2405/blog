import React from 'react'
import { Link } from 'react-router-dom'
import { appwriteService } from '../appwrite/config'

function PostCard({ $id, title, featuredImage, content }) {
    // Function to strip HTML tags and get plain text
    const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <Link to={`/post/${$id}`}>
            <div className='group relative w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
                <div className='relative h-64 overflow-hidden'>
                    {featuredImage ? (
                        <img 
                            src={appwriteService.getFilePreview(featuredImage)} 
                            alt={title} 
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                        />
                    ) : (
                        <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                            <span className='text-gray-400'>No image available</span>
                        </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
                
                <div className='p-6'>
                    <h2 className='text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300'>
                        {title}
                    </h2>
                    <p className='text-gray-600 text-sm line-clamp-3 mb-4'>
                        {stripHtml(content)}
                    </p>
                    <div className='flex items-center text-blue-600 font-medium'>
                        <span>Read More</span>
                        <svg 
                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard