import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Info,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardPageProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  onOpenAuth
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Summary */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-200 text-emerald-950 font-black text-2xl flex items-center justify-center shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Level 2 Citizen
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              {user.email} • {user.city}
            </p>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              Active contributor since {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('identify')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Identify Waste</span>
          </button>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-xs transition-colors"
          >
            Profile Settings
          </button>
        </div>
      </div>

      {/* Primary Impact Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Your Environmental Impact</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Updated in real-time
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Waste Identified
            </span>
            <p className="text-3xl font-black text-slate-900 mt-2">
              {user.stats.itemsIdentified}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Items sorted via PrithveX
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Waste Diverted
            </span>
            <p className="text-3xl font-black text-emerald-700 mt-2">
              {user.stats.wasteDivertedKg} <span className="text-sm font-bold">kg</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Prevented from open dumps
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              CO₂e Avoided
            </span>
            <p className="text-3xl font-black text-teal-700 mt-2">
              {user.stats.co2AvoidedKg} <span className="text-sm font-bold">kg</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Emissions mitigated
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Reports Lodged
            </span>
            <p className="text-3xl font-black text-rose-600 mt-2">
              {user.stats.reportsSubmitted}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Ward black-spot grievances
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Actions Logged
            </span>
            <p className="text-3xl font-black text-purple-700 mt-2">
              {user.stats.sustainableActions}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Compost & reuse cycles
            </p>
          </div>
        </div>

        {/* Calculation Assumptions Disclosure (Transparent Science) */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Transparent Impact Methodology:</strong> Heuristic baseline calculates ~0.35kg diverted per household item segregated, preventing anaerobic decomposition in landfills which emits methane. Each kg of segregated dry recyclables avoids an estimated 1.48kg CO₂ equivalent based on CPCB life-cycle assessments.
          </p>
        </div>
      </div>

      {/* Two Column Grid: Badges & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Earned Badges (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Earned Citizen Badges</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {user.badges.length}/6 Unlocked
            </span>
          </h3>

          <div className="space-y-3">
            {user.badges.map((b) => (
              <div
                key={b.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Unlocked: {b.unlockedAt}</p>
                </div>
              </div>
            ))}

            {/* Next badge to unlock */}
            <div className="p-3.5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-start gap-3 opacity-60">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-xs">Zero Waste Society Lead</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Organize 5 community drives or log 50kg diverted
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Progress: 57%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Log (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Recent Activity History</span>
            </span>
            <button
              onClick={() => onNavigate('identify')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              + Log New Action
            </button>
          </h3>

          <div className="space-y-3">
            {user.recentActivity && user.recentActivity.length > 0 ? (
              user.recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{act.action}</p>
                    <p className="text-[11px] text-slate-500">{act.details}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {act.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No recent activity logged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
