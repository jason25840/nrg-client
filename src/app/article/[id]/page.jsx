'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import PageLayout from '../../components/ui/PageLayout';
import axios from 'axios';

export default function ArticlePage() {
  const [article, setArticle] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ new hook

  const from = searchParams.get('from') || '/article';

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${params.id}`);
        setArticle(res.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    if (params?.id) {
      fetchArticle();
    }
  }, [params?.id]);

  if (!article) return <p>Loading...</p>;

  return (
    <PageLayout>
      <div className='container mx-auto py-10'>
        <button
          onClick={() => router.push(from)}
          className='text-[--ember-orange] hover:underline'
        >
          ← Go Back
        </button>

        <h1 className='text-4xl font-bold mt-4'>{article.title}</h1>
        <p className='text-gray-500 mt-2'>
          {article.category} •{' '}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>

        <img
          src={article.image || '/images/placeholder.png'}
          alt={article.title || 'NRGLines Placeholder'}
          className='w-full h-96 object-cover rounded-xl mt-6'
        />

        <div className='mt-6 text-lg leading-relaxed text-foreground'>
          {article.content}
        </div>
      </div>
    </PageLayout>
  );
}
