'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ArticleCreate from './components/ArticleCreateModal';
import PageLayout from '../../components/ui/PageLayout';
import Button from '../../components/ui/Buttons';
import Link from 'next/link';

export default function AdminArticlesPage() {
  const { user } = useSelector((state) => state.auth);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('/api/articles');
      setArticles(res.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      fetchArticles(); // Refresh list
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <PageLayout>
      <div className='p-6'>
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-semibold text-[--primary-blue]'>
              Manage Articles
            </h2>
            <Button
              //className='bg-[--primary-green] hover:bg-[--accent-pink] text-white px-4 py-2 rounded-lg transition'
              onClick={handleCreate}
            >
              ➕ New Article
            </Button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : articles.length === 0 ? (
            <p>No articles created by this user yet.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {articles.map((article) => (
                <motion.div
                  key={article._id}
                  className='p-4 border rounded-lg shadow hover:shadow-md transition'
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className='text-lg font-bold mb-2'>{article.title}</h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    {article.snippet}
                  </p>
                  <div className='flex gap-3'>
                    <Button
                      onClick={() => handleEdit(article)}
                      className='text-sm text-black hover:underline'
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(article._id)}
                      className='text-sm text-red-600 hover:underline'
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className='flex justify-end mt-4'>
            <Link
              href='/dashboard'
              className='bg-[--primary-green] hover:bg-[--accent-pink] text-white px-4 py-2 rounded-lg transition'
            >
              Return To dashboard
            </Link>
          </div>
        </motion.div>

        {isModalOpen && (
          <ArticleCreate
            article={selectedArticle}
            onClose={() => {
              setIsModalOpen(false);
              fetchArticles();
              alert('✅ Article created successfully!');
            }}
          />
        )}
      </div>
    </PageLayout>
  );
}
