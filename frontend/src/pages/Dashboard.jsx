import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { FiEdit3 } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await postsAPI.getAll();
      setPosts(res.data);
    } catch {
      toast.error('Failed to load posts');
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setCreating(true);
    try {
      await postsAPI.create({ content: newPost.trim() });
      setNewPost('');
      toast.success('Posted successfully 🎉');
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await postsAPI.like(id);
      fetchPosts();
    } catch {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, text) => {
    try {
      await postsAPI.comment(postId, { text });
      fetchPosts();
    } catch {
      toast.error('Failed to comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsAPI.delete(id);
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Feed</h1>
        <p className="text-slate-500">See what's happening around your campus.</p>
      </div>

      {/* Create post card */}
      <Card className="mb-8 p-5">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-700 font-bold text-lg flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <form onSubmit={createPost} className="flex-1">
            <div className="relative">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none min-h-[100px]"
                placeholder={`Share something with your network, ${user?.name?.split(' ')[0]}?`}
              />
              <div className="absolute top-3 right-3 text-slate-300">
                <FiEdit3 size={18} />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button type="submit" variant="primary" disabled={creating || !newPost.trim()}>
                {creating ? 'Posting...' : 'Share Post'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card className="text-center py-16 px-6">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✍️</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No posts yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Your feed is pretty quiet. Be the first to share an update with your network!</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onDelete={handleDelete} 
              onLike={handleLike} 
              onComment={handleComment} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
