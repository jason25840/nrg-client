// hooks/useLikeBookmark.js
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  toggleLikeArticle,
  toggleBookmarkArticle,
} from '../redux/slices/articleSlice';
import {
  toggleLikeEvent,
  toggleBookmarkEvent,
} from '../redux/slices/eventSlice';
import { fetchProfile } from '../redux/slices/profileSlice';
import { useAuthToast } from '../components/toasts/useAuthToast';

export const useLikeBookmark = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const showAuthToast = useAuthToast();

  const handleLike = async (type, id) => {
    if (!user) return showAuthToast('like');
    try {
      if (type === 'article') await dispatch(toggleLikeArticle(id)).unwrap();
      if (type === 'event') await dispatch(toggleLikeEvent(id)).unwrap();
    } catch (error) {
      console.error(`Error liking ${type}:`, error);
    }
  };

  const handleBookmark = async (type, id) => {
    if (!user) return showAuthToast('bookmark');

    try {
      if (type === 'article') {
        const result = await dispatch(toggleBookmarkArticle(id)).unwrap();
        await dispatch(fetchProfile(user._id));

        if (result.action === 'bookmarked') {
          toast.success('Article saved to dashboard!');
        } else if (result.action === 'unbookmarked') {
          toast.info('Article removed from dashboard.');
        }
      }

      if (type === 'event') {
        const result = await dispatch(toggleBookmarkEvent(id)).unwrap();
        await dispatch(fetchProfile(user._id));

        if (result.action === 'bookmarked') {
          toast.success('Event saved to dashboard!');
        } else if (result.action === 'unbookmarked') {
          toast.info('Event removed from dashboard.');
        }
      }
    } catch (error) {
      console.error(`Error bookmarking ${type}:`, error);
    }
  };

  return { handleLike, handleBookmark };
};
