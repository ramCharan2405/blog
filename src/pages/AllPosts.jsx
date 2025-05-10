import React, { useEffect, useState } from 'react'
import { appwriteService } from "../appwrite/config"
import { PostCard } from '../components'

function AllPosts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    return (
        <div className='w-full py-8'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllPosts
