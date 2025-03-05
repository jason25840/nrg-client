'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles } from '../redux/slices/blogSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageLayout from '../components/ui/PageLayout';
import ArticleCard from './components/ArticleCard';
import ArticlePopup from './components/ArticlePopup'; // ✅ Import popup modal

export default function Blog() {
  const dispatch = useDispatch();
  const [selectedArticle, setSelectedArticle] = useState(null); // ✅ Track clicked article

  // Get state from Redux store
  const { articles, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <PageLayout>
      <div className='container mx-auto p-10'>
        {/* Header */}
        <h1 className='text-5xl font-bold mb-6 mt-10 text-foreground text-center'>
          Gorge Life
        </h1>
        <p className='text-lg text-center text-foreground-light mb-10 max-w-3xl mx-auto'>
          Read about the adventures, towns, and activities of the New River
          Gorge National Park.
        </p>

        {/* ✅ Loading & Error Handling */}
        {loading && <LoadingSpinner />}
        {error && (
          <p className='text-center text-red-500'>
            {error.message || 'An error occurred'}
          </p>
        )}

        {/* ✅ Featured Article - Full Width */}
        {articles.length > 0 && (
          <div
            className='relative mb-12 w-full max-w-6xl mx-auto cursor-pointer'
            onClick={() => setSelectedArticle(articles[0])} // ✅ Open modal
          >
            <img
              src={articles[0].image}
              alt={articles[0].title}
              className='w-full h-[450px] object-cover rounded-xl shadow-lg'
            />
            <div className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-xl'>
              <h2 className='text-3xl font-bold'>{articles[0].title}</h2>
              <p className='text-sm opacity-80'>{articles[0].snippet}</p>
            </div>
          </div>
        )}

        {/* ✅ Blog Articles Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {articles.slice(1).map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </div>
      </div>

      {/* ✅ Popup Modal for Full Article */}
      {selectedArticle && (
        <ArticlePopup
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)} // ✅ Close the modal
        />
      )}
    </PageLayout>
  );
}
