'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function BlogPost({ params }) {
  const [article, setArticle] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${params.id}`);
        setArticle(res.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className='container mx-auto py-10'>
      <button onClick={() => router.back()} className='text-primary'>
        ← Back to Blog
      </button>

      <h1 className='text-4xl font-bold mt-4'>{article.title}</h1>
      <p className='text-gray-500 mt-2'>
        {article.category} • {article.date}
      </p>

      <img
        src={article.image}
        alt={article.title}
        className='w-full h-96 object-cover rounded-xl mt-6'
      />

      <div className='mt-6 text-lg leading-relaxed text-foreground'>
        {article.content}
      </div>
    </div>
  );
}
