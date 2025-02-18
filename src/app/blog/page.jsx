'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchArticles } from '../redux/slices/blogSlice';
import ArticleCard from './components/ArticleCard';

export default function Blog() {
  const dispatch = useDispatch();
  const router = useRouter();
  const placeHolderImage =
    'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZXJyb3J8ZW58MHx8MHx8fDA%3D';

  // Get state from Redux store
  const { articles, loading, error } = useSelector((state) => state.blog);

  // Fetch articles when the component mounts
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <div className='container mx-auto py-10'>
      {/* Header */}
      <h1 className='text-5xl font-bold mb-6 text-foreground text-center'>
        Gorge Life
      </h1>
      <p className='text-lg text-center text-foreground-light mb-10 max-w-3xl mx-auto'>
        Read about the adventures, towns, and activities of the New River Gorge
        National Park.
      </p>

      {/* ✅ Loading & Error Handling */}
      {loading && <p className='text-center'>Loading articles...</p>}
      {error && (
        <p className='text-center text-red-500'>
          {error.message || 'An error occurred'}
        </p>
      )}

      {/* ✅ Featured Article (First Item) */}
      {articles.length > 0 && (
        <div
          className='relative mb-12 w-full max-w-5xl mx-auto cursor-pointer'
          onClick={() => router.push(`/blog/${articles[0]._id}`)}
        >
          <img
            src={articles[0].image || placeHolderImage}
            alt={articles[0].title || 'Article Title'}
            className='w-full h-80 object-cover rounded-xl'
          />
          <div className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-xl'>
            <h2 className='text-3xl font-bold'>{articles[0].title}</h2>
            <p className='text-sm opacity-80'>
              {articles[0].snippet || 'No description available'}
            </p>
          </div>
        </div>
      )}

      {/* ✅ Blog Articles Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr'>
        {articles.slice(1).map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
}
