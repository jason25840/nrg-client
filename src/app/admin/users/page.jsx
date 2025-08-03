'use client';

import React, { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace the URL with your actual users endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className='p-6'>Loading users...</p>;
  }
  if (error) {
    return (
      <p className='p-6 text-red-600'>Error loading users: {error.message}</p>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>All Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className='list-disc pl-5'>
          {users.map((user) => (
            <li key={user._id}>
              {user.name || user.username || user.email || user._id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
