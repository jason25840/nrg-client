'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import ClientOnlyTime from '../../components/ClientOnlyTime';

export default function GeneralChat() {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [usersOnline, setUsersOnline] = useState(0);
  const socket = useRef(null);

  useEffect(() => {
    if (!user) return;

    axios
      .get('http://localhost:5001/api/chat/general')
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error('Failed to load messages:', err.message);
      });

    socket.current = io('http://localhost:5001', {
      query: {
        username: user.username || user.name || 'Anonymous',
      },
    });

    socket.current.emit('joinRoom', 'general');

    socket.current.on('usersOnline', (count) => {
      setUsersOnline(count);
    });

    socket.current.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.off('usersOnline');
      socket.current.off('chatMessage');
      socket.current.disconnect();
    };
  }, [user]);

  const sendMessage = async () => {
    if (input.trim() || mediaFile) {
      try {
        const formData = new FormData();
        formData.append('text', input);
        formData.append('room', 'general');
        if (mediaFile) {
          formData.append('media', mediaFile);
        }

        const res = await axios.post(
          'http://localhost:5001/api/chat',
          formData,
          {
            withCredentials: true, // ✅ Send cookies/session with the request
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setMessages((prev) => [...prev, res.data]); // 👈 Add message to local UI
        socket.current.emit('chatMessage', res.data); // emit only if message passes server filter
        setInput('');
        setMediaFile(null);
      } catch (err) {
        console.error(
          'Message rejected:',
          err.response?.data?.message || err.message
        );
        alert(err.response?.data?.message || 'Error sending message');
      }
    }
  };

  const handleReaction = (messageId, emoji) => {
    if (socket.current) {
      socket.current.emit('reactToMessage', { messageId, emoji });
    }
  };

  return (
    <div className='flex flex-col h-full w-full bg-primary-bg text-primary-text text-sm sm:text-base'>
      <div className='flex items-center justify-between px-4 py-2 border-b'>
        <h2 className='text-lg font-semibold'>General Chat</h2>
        <span className='text-sm text-gray-400'>{usersOnline} online</span>
      </div>
      <div className='px-4 py-1 text-sm text-yellow-300 bg-yellow-900'>
        📸 You can upload one image or video per message here. For more media,
        head to the sport-specific pages.
      </div>
      <div className='flex-1 overflow-y-auto px-2 py-4 sm:px-4 space-y-2'>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className='bg-primary-bg px-3 py-2 sm:px-4 sm:py-3 rounded shadow group relative max-w-full sm:max-w-xl md:max-w-2xl mx-auto'
          >
            <p className='text-sm font-semibold'>
              {msg.senderUsername
                ? `@${msg.senderUsername}`
                : msg.username || msg.user}
            </p>
            <p className='text-sm'>
              {(msg.text || msg.message)?.split(' ').map((word, i) => {
                const isMention = word.startsWith('@');
                const cleanUsername = word.slice(1).toLowerCase();

                return isMention ? (
                  <a
                    key={i}
                    href={`/profile/${cleanUsername}`}
                    className='font-bold hover:underline cursor-pointer'
                    style={{ color: 'var(--highlight-yellow-light)' }}
                  >
                    {word}{' '}
                  </a>
                ) : (
                  <span key={i}>{word} </span>
                );
              })}
            </p>
            {new Date(msg.createdAt).toDateString() !==
              new Date().toDateString() && (
              <ClientOnlyTime timestamp={msg.createdAt} showFullDate />
            )}
            {msg.media && msg.media.endsWith('.mp4') ? (
              <>
                {console.log('MEDIA URL:', msg.media)}
                <video controls className='mt-2 max-w-xs rounded'>
                  <source
                    src={
                      msg.media.startsWith('http')
                        ? msg.media
                        : `http://localhost:5001${msg.media}`
                    }
                    type='video/mp4'
                  />
                  Your browser does not support the video tag.
                </video>
              </>
            ) : msg.media ? (
              <img
                src={msg.media}
                alt='Media'
                className='mt-2 max-w-xs rounded'
              />
            ) : null}
            <div className='flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
              {['👍', '😂', '🔥', '❤️', '👎'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(msg._id, emoji)}
                  className='text-xl hover:scale-110 transition-transform'
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='px-2 py-4 sm:px-4 border-t flex flex-col gap-2'>
        {mediaFile && (
          <div className='text-sm text-gray-300'>
            Selected file: {mediaFile.name}
          </div>
        )}
        <input
          type='file'
          accept='image/*,video/*'
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            const isValidType =
              file.type.startsWith('image/') || file.type.startsWith('video/');
            if (!isValidType) {
              alert('Only image and video files are allowed.');
              return;
            }

            if (file.size > 25 * 1024 * 1024) {
              alert('File too large. Max 25MB allowed.');
              return;
            }

            if (file.type.startsWith('video/')) {
              const video = document.createElement('video');
              video.preload = 'metadata';
              video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 60) {
                  alert('Video too long. Max 60 seconds allowed.');
                } else {
                  setMediaFile(file);
                }
              };
              video.src = URL.createObjectURL(file);
            } else {
              setMediaFile(file);
            }
          }}
          className='text-sm'
        />
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder='Type your message...'
          className='flex-1 border p-2 rounded bg-primary-bg text-primary-text w-full'
        />
      </div>
    </div>
  );
}
