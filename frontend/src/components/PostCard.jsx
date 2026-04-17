import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from './Card';
import { FiHeart, FiMessageSquare, FiTrash2, FiClock } from 'react-icons/fi';
import Button from './Button';
import Input from './Input';

export default function PostCard({ post, onDelete, onLike, onComment }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = post.likes?.some(id => id === user?.id || id?._id === user?.id);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  return (
    <Card className="p-5 mb-5 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-100 to-primary-100 flex items-center justify-center text-primary-700 font-bold shadow-sm">
            {post.userId?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-slate-800 font-semibold">{post.userId?.name}</p>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
              <FiClock size={12} />
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        {(post.userId?._id === user?.id || user?.role === 'admin') && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete post"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-700 text-[15px] leading-relaxed mb-5 whitespace-pre-wrap">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLiked ? 'text-secondary-500' : 'text-slate-500 hover:text-secondary-500'
          }`}
        >
          <FiHeart size={18} className={isLiked ? 'fill-current' : ''} />
          <span>{post.likes?.length || 0}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-500 transition-colors"
        >
          <FiMessageSquare size={18} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
            {post.comments?.map((c, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-800">{c.userId?.name}</span>
                <span className="text-sm text-slate-600">{c.text}</span>
              </div>
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-2">No comments yet. Be the first!</p>
            )}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button type="submit" variant="primary" disabled={!commentText.trim()} className="!px-4">
              Post
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}
