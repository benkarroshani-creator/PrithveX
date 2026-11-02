import React, { useState } from 'react';
import { 
  Heart, 
  PlusCircle, 
  MapPin, 
  ShieldCheck, 
  Send,
  X
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
      authorName: authorName.trim() || currentUser.name || 'Citizen',
      authorCity: authorCity.trim() || currentUser.city || 'India',
      title: title.trim(),
      type,
      content: content.trim(),
      tags: tags.length > 0 ? tags : ['circularity', 'swachhbharat'],
    });

    onRefreshPosts();
    onShowToast('Action logged to Firestore. Awaiting moderator review.', 'success');
    setTitle('');
    setContent('');
    setTagsInput('');
    setIsSubmitOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Citizen Action Network</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Real-World Zero Waste Initiatives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Community Circularity Wall
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real experiences, home composting breakthroughs, residential society recycling drives, and plastic reduction tactics shared by citizens across India.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(!isSubmitOpen)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isSubmitOpen ? 'Close Form' : 'Share Action'}</span>
        </button>
      </div>

      {/* Moderation note */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Submissions are saved to Firebase Firestore and verified by community moderators before public publishing to maintain high-quality guidance.
        </span>
      </div>

      {/* Submit Form Dialog / Collapsible Box */}
      {isSubmitOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 border border-slate-300 shadow-sm space-y-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-900 text-sm">Post a Community Initiative</h3>
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Citizen name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={authorCity}
                onChange={(e) => setAuthorCity(e.target.value)}
                placeholder="City"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Action Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-slate-900"
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
            <label className="block font-medium text-slate-700 mb-1">Post Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Swapped all milk packets for glass bottles in our 40-flat apartment"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Story & Steps *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Share what worked, how you solved logistics, and the impact achieved..."
              required
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="composting, milkpouch, zero-waste, bengaluru"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Verification</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {postTypes.map((pt) => {
          const isActive = selectedType === pt;
          return (
            <button
              key={pt}
              onClick={() => setSelectedType(pt)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pt === 'all' ? 'All Stories' : pt}
            </button>
          );
        })}
      </div>

      {/* Community Posts Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              {/* Header meta */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900">{post.authorName}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{post.authorCity}</span>
                </div>
                <span>{post.createdAt}</span>
              </div>

              {/* Title & Type */}
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">{post.type}</p>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{post.title}</h3>
              </div>

              {/* Content */}
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500 font-mono">
                  {post.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer like button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4 text-xs">
              <span className="text-[11px] text-slate-400">
                {post.status === 'Approved' ? 'Verified Citizen Action' : 'Pending Review'}
              </span>

              <button
                onClick={() => handleLike(post.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-rose-600 transition-colors font-medium text-xs tabular-nums"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{post.likesCount}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
