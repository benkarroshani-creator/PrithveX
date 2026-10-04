import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Filter,
  ShieldAlert,
  Send
} from 'lucide-react';
import { CommunityPost, UserProfile } from '../types';
import { addCommunityPost, toggleLikeCommunityPost } from '../services/storageService';

interface CommunityPageProps {
  posts: CommunityPost[];
  onRefreshPosts: () => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  posts,
  onRefreshPosts,
  currentUser,
  onOpenAuth,
  onShowToast
}) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Form states
  const [authorName, setAuthorName] = useState(currentUser.name || '');
  const [authorCity, setAuthorCity] = useState(currentUser.city || 'Bengaluru');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CommunityPost['type']>('Sustainable action');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const postTypes: (CommunityPost['type'] | 'all')[] = [
    'all',
    'Sustainable action',
    'Waste reduction idea',
    'Recycling experience',
    'Community cleanup',
    'Composting activity',
    'Local initiative',
  ];

  const filteredPosts = posts.filter((p) => {
    // Show approved posts to general public; also show user's own pending posts
    const isApproved = p.status === 'Approved';
    const isAuthor = p.authorName === currentUser.name;
    const matchesVisibility = isApproved || isAuthor;
    const matchesType = selectedType === 'all' || p.type === selectedType;
    return matchesVisibility && matchesType;
  });

  const handleLike = async (id: string) => {
    await toggleLikeCommunityPost(id);
    onRefreshPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onShowToast('Please provide both a title and description.', 'info');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    await addCommunityPost({
      authorName: authorName.trim() || currentUser.name || 'Anonymous Citizen',
      authorCity: authorCity.trim() || currentUser.city || 'India',
      title: title.trim(),
      type,
      content: content.trim(),
      tags: tags.length > 0 ? tags : ['circularity', 'swachhbharat'],
    });

    onRefreshPosts();
    onShowToast('Action submitted to Firestore! Pending community moderator review.', 'success');
    setTitle('');
    setContent('');
    setTagsInput('');
    setIsSubmitOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Citizen Action Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            Community Sustainability Wall
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real stories, composting triumphs, neighborhood cleanups, and plastic reduction ideas shared by citizens across India.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(!isSubmitOpen)}
          className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Your Sustainable Action</span>
        </button>
      </div>

      {/* Moderation Notice Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Community Moderation Policy:</strong> All citizen submissions undergo review by verified community moderators before public publishing to maintain spam-free, high-quality circular guidance.
        </span>
      </div>

      {/* Submission Drawer / Card */}
      {isSubmitOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-4 animate-in slide-in-from-top duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Share an Initiative or Experience</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Requires Moderator Approval
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Ananya Rao"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Locality
              </label>
              <input
                type="text"
                required
                value={authorCity}
                onChange={(e) => setAuthorCity(e.target.value)}
                placeholder="e.g. Pune / Kothrud"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Action Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-emerald-600"
              >
                <option value="Sustainable action">Sustainable Action</option>
                <option value="Waste reduction idea">Waste Reduction Idea</option>
                <option value="Recycling experience">Recycling Experience</option>
                <option value="Community cleanup">Community Cleanup</option>
                <option value="Composting activity">Composting Activity</option>
                <option value="Local initiative">Local Initiative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headline / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Replaced single-use milk packets with steel can delivery from local milkman"
              className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Details & Impact (What steps did you take? What was the outcome?)
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe what you did, difficulties overcome, cost savings, or how many kilos of waste were diverted..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-emerald-600"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. composting, zerowaste, bangalore, milk-pouch"
              className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Moderation</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-600 shrink-0">Filter:</span>
        {postTypes.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
              selectedType === t
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t === 'all' ? 'All Community Actions' : t}
          </button>
        ))}
      </div>

      {/* Posts Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header: Author & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {post.authorName}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{post.authorCity}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {post.type}
                  </span>

                  {post.status === 'Pending review' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>In Review</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.tags.map((tg) => (
                    <span
                      key={tg}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Footer */}
            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>

              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors font-semibold"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{post.likesCount} Helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
