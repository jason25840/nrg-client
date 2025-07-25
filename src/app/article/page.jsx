'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchProfile } from '../redux/slices/profileSlice';
import {
  fetchArticles,
  toggleLikeArticle,
  toggleBookmarkArticle,
} from '../redux/slices/articleSlice';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageLayout from '../components/ui/PageLayout';
import ArticleCard from './components/ArticleCard';
//import ArticlePost from './components/ArticlePost';

export default function Article() {
  const dispatch = useDispatch();
  //const [selectedArticle, setSelectedArticle] = useState(null);
  const { articles, loading, error } = useSelector((state) => state.article);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // ✅ Handle Like Click
  const handleLike = (e, articleId) => {
    e.stopPropagation();

    if (!user) {
      toast.warn(
        <div>
          <span>You must sign in to like articles. </span>
          <button
            onClick={() => router.push('/signin?from=/article')}
            className='text-primary-blue underline ml-1'
          >
            Sign in now
          </button>
        </div>,
        { autoClose: 5000 }
      );
      return;
    }
    dispatch(toggleLikeArticle(articleId));
    dispatch(fetchArticles());
  };

  // ✅ Handle Bookmark Click
  const handleBookmark = async (e, articleId) => {
    e.stopPropagation();

    if (!user) {
      toast.warn(
        <div>
          <span>You must sign in to save articles. </span>
          <button
            onClick={() => router.push('/signin?from=/article')}
            className='text-primary-blue underline ml-1'
          >
            Sign in now
          </button>
        </div>,
        { autoClose: 5000 }
      );
      return;
    }
    await dispatch(toggleBookmarkArticle(articleId));
    await dispatch(fetchArticles());
    await dispatch(fetchProfile(user._id));
  };

  return (
    <PageLayout>
      {/* ✅ Light Background for Article Page (Reversed Contrast) */}
      <div className='container mx-auto p-10 bg-background-light text-foreground-light'>
        {/* ✅ Article Title */}
        <h1 className='text-5xl text-gray-900 font-bold mb-6 mt-10 text-center'>
          Gorge Life
        </h1>
        <p className='text-lg text-center text-gray-700 mb-10 max-w-3xl mx-auto'>
          Read about the adventures, towns, and activities of the New River
          Gorge National Park.
        </p>

        {/* ✅ Loading & Error Handling */}
        {loading && <LoadingSpinner />}
        {error && (
          <p className='text-center text-error'>
            {error.message || 'An error occurred'}
          </p>
        )}

        {/* ✅ Featured Article (Light Background, Dark Text) */}
        {articles.length > 0 && (
          <div className='bg-white text-black border border-border rounded-xl shadow-lg p-6'>
            <ArticleCard
              article={articles[0]}
              onClick={() =>
                router.push(`/article/${articles[0]._id}?from=/article`)
              }
              onLike={handleLike}
              onBookmark={handleBookmark}
              isFeatured={true} // ✅ Special styling for featured article
            />
          </div>
        )}

        {/* ✅ Articles Grid (Dark Cards Stay Unchanged) */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
          {articles.slice(1).map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onClick={() =>
                router.push(`/article/${article._id}?from=/article`)
              }
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
