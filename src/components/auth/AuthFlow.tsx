import React, { useState } from 'react';
import { UserRole, AuthStep } from '../../types';
import { 
  GraduationCap, 
  Building2, 
  Landmark, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Clock,
  Ban,
  Info
} from 'lucide-react';
import { loadApprovalRecords, saveApprovalRecords, ApprovalRecord } from '../../data/approvalStore';

interface AuthFlowProps {
  currentStep: AuthStep;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNavigateStep: (step: AuthStep) => void;
  onCompleteAuth: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({
  currentStep,
  selectedRole,
  onSelectRole,
  onNavigateStep,
  onCompleteAuth,
}) => {
  // Form states
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [loginIdentifierType, setLoginIdentifierType] = useState<'email' | 'username'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form inputs
  const [fullName, setFullName] = useState(
    selectedRole === 'student' ? 'Harshit Seth' : selectedRole === 'company' ? 'TechNova Solutions' : 'MBM University, Jodhpur'
  );
  const [email, setEmail] = useState(
    selectedRole === 'student' ? 'harshit.seth@itj.ac.in' : selectedRole === 'company' ? 'talent@technova.io' : 'tpo@itj.ac.in'
  );
  const [username, setUsername] = useState(
    selectedRole === 'student' ? 'harshitseth' : selectedRole === 'company' ? 'technova_official' : 'mbmjodhpur_tpo'
  );
  const [dob, setDob] = useState('2004-05-14');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');

  const roleConfigs = {
    student: {
      name: 'Student',
      description: 'Verify your project code logic, showcase verified skills, and match with top hiring squads.',
      icon: GraduationCap,
      accentHex: '#4F46E5',
      accentBg: 'bg-indigo-600',
      accentText: 'text-indigo-600',
      accentPill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      hoverGlow: 'hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.18)]',
      gradientBtn: 'from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600',
      welcomeMsg: 'Welcome aboard, Harshit! Your student career matrix is calibrated.',
      welcomeSub: 'Redirecting to your personalized Readiness Dashboard...',
    },
    company: {
      name: 'Company / Recruiter',
      description: 'Access AI-verified candidates, conduct blind screening, and eliminate hiring noise.',
      icon: Building2,
      accentHex: '#1E3A8A',
      accentBg: 'bg-blue-900',
      accentText: 'text-blue-900',
      accentPill: 'bg-blue-50 text-blue-900 border-blue-200',
      hoverGlow: 'hover:border-blue-800 hover:shadow-[0_0_25px_rgba(30,58,138,0.22)]',
      gradientBtn: 'from-blue-900 to-indigo-950 hover:from-blue-800 hover:to-indigo-900',
      welcomeMsg: 'Welcome back, TechNova Solutions! Talent pipeline is ready.',
      welcomeSub: 'Redirecting to Candidate Screening & Job Match analytics...',
    },
    institution: {
      name: 'Institution / TPO',
      description: 'Analyze curriculum gaps against industry demand, track student readiness, and audit integrity.',
      icon: Landmark,
      accentHex: '#0F766E',
      accentBg: 'bg-teal-700',
      accentText: 'text-teal-700',
      accentPill: 'bg-teal-50 text-teal-800 border-teal-200',
      hoverGlow: 'hover:border-teal-600 hover:shadow-[0_0_25px_rgba(15,118,110,0.2)]',
      gradientBtn: 'from-teal-700 to-emerald-800 hover:from-teal-600 hover:to-emerald-700',
      welcomeMsg: 'Welcome, MBM University, Jodhpur (TPO)!',
      welcomeSub: 'Loading Institutional Curriculum Heatmap & Readiness reports...',
    },
    admin: {
      name: 'Super Admin',
      description: 'Platform integrity, university approvals, student AST plagiarism audits, and employer verification.',
      icon: ShieldCheck,
      accentHex: '#0F172A',
      accentBg: 'bg-slate-900',
      accentText: 'text-slate-900',
      accentPill: 'bg-slate-900 text-white border-slate-700',
      hoverGlow: 'hover:border-slate-800 hover:shadow-[0_0_25px_rgba(15,23,42,0.25)]',
      gradientBtn: 'from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900',
      welcomeMsg: 'Welcome back, Super Admin! Governance matrix online.',
      welcomeSub: 'Redirecting to SkillBridge Admin Control Center...',
    },
  };

  const activeConfig = roleConfigs[selectedRole] || roleConfigs.student;

  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [showSignupPendingNotice, setShowSignupPendingNotice] = useState<boolean>(false);

  // Handle submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMessage(null);

    // Check Approval Status for Company and Institution
    if (selectedRole === 'company' || selectedRole === 'institution') {
      const records = loadApprovalRecords();
      const match = records.find(r => 
        r.email.toLowerCase() === email.toLowerCase() || 
        r.name.toLowerCase().includes(fullName.toLowerCase())
      );

      if (currentStep === 'signup') {
        // Enforce: Company or TPO sign up -> requires one-time Admin approval!
        const newRecord: ApprovalRecord = {
          id: `${selectedRole === 'company' ? 'COM' : 'UNI'}_${Date.now()}`,
          name: fullName,
          role: selectedRole,
          email: email,
          status: 'pending_approval',
          registeredAt: 'Just Now',
        };
        const updated = [...records.filter(r => r.email.toLowerCase() !== email.toLowerCase()), newRecord];
        saveApprovalRecords(updated);
        setShowSignupPendingNotice(true);
        return;
      }

      if (currentStep === 'login') {
        if (match) {
          if (match.status === 'delisted') {
            setAuthErrorMessage(`Account Delisted: Your organization has been suspended by the platform Administrator. Reason: ${match.delistedReason || 'Integrity review'}`);
            return;
          }
          if (match.status === 'pending_approval') {
            setAuthErrorMessage('Approval Pending: Your signup is awaiting one-time Admin verification. Once approved by Admin, you can log in directly anytime without asking for approval again.');
            return;
          }
        }
      }
    }

    // Direct Login / Access for Approved Entities & Students
    onNavigateStep('welcome');
    setTimeout(() => {
      onCompleteAuth();
    }, 1800);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="w-full max-w-xl">
        {/* Step 1: Role Selection Screen */}
        {currentStep === 'role-select' && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select Your Ecosystem Role</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Join SkillBridge
              </h1>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Connect verified skills, industry positions, and university curricula with AI logic validation.
              </p>
            </div>

            <div className="space-y-4">
              {(['student', 'company', 'institution', 'admin'] as UserRole[]).map((roleKey) => {
                const config = roleConfigs[roleKey];
                const Icon = config.icon;
                const isSelected = selectedRole === roleKey;

                return (
                  <div
                    key={roleKey}
                    id={`role-card-${roleKey}`}
                    onClick={() => onSelectRole(roleKey)}
                    className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 bg-white ${
                      isSelected
                        ? `border-2 border-[${config.accentHex}] shadow-sm bg-slate-50/50`
                        : `border-slate-200 ${config.hoverGlow}`
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                          isSelected ? `${config.accentBg} text-white` : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-bold text-slate-900">
                            {config.name}
                          </h2>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? `border-[${config.accentHex}] bg-[${config.accentHex}] text-white`
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                id="continue-to-signup-btn"
                onClick={() => onNavigateStep('signup')}
                className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-150 bg-gradient-to-r ${activeConfig.gradientBtn}`}
              >
                <span>Continue as {activeConfig.name.split('/')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                id="toggle-direct-login-btn"
                onClick={() => onNavigateStep('login')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                Already have an account? <span className="underline font-semibold">Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Sign Up Screen */}
        {currentStep === 'signup' && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            {/* Top Back & Role Badge */}
            <div className="flex items-center justify-between mb-6">
              <button
                id="back-to-role-select-btn"
                onClick={() => onNavigateStep('role-select')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Role</span>
              </button>

              <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${activeConfig.accentPill}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                <span>{activeConfig.name}</span>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create your Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your details to generate your verified SkillBridge profile.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name / Organization Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="signup-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Harshit Seth"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Email / Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="harshit@itj.ac.in"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="harshitseth"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date of Birth / Inception Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="signup-dob"
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Gradient CTA Button */}
              <button
                type="submit"
                id="submit-signup-btn"
                className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-150 bg-gradient-to-r ${activeConfig.gradientBtn}`}
              >
                <span>Create Account & Start</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  id="goto-login-btn"
                  onClick={() => onNavigateStep('login')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Have an account? <span className="underline font-semibold">Log In</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Login Screen */}
        {currentStep === 'login' && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            {/* Top Back & Role Badge */}
            <div className="flex items-center justify-between mb-6">
              <button
                id="back-to-signup-step"
                onClick={() => onNavigateStep('role-select')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Role</span>
              </button>

              <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${activeConfig.accentPill}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                <span>{activeConfig.name}</span>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Log In to SkillBridge
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Authenticate with your credentials to access verified workflows.
              </p>
            </div>

            {authErrorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{authErrorMessage}</span>
                </div>
              </div>
            )}

            {/* Toggle Email vs Username */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200/80 text-xs font-medium">
              <button
                type="button"
                id="login-toggle-email"
                onClick={() => setLoginIdentifierType('email')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  loginIdentifierType === 'email'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Login with Email
              </button>
              <button
                type="button"
                id="login-toggle-username"
                onClick={() => setLoginIdentifierType('username')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  loginIdentifierType === 'username'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Login with Username
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {loginIdentifierType === 'email' ? 'Email Address' : 'Username'}
                </label>
                <div className="relative">
                  {loginIdentifierType === 'email' ? (
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  ) : (
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  )}
                  <input
                    id="login-identifier"
                    type={loginIdentifierType === 'email' ? 'email' : 'text'}
                    required
                    value={loginIdentifierType === 'email' ? email : username}
                    onChange={(e) => {
                      if (loginIdentifierType === 'email') setEmail(e.target.value);
                      else setUsername(e.target.value);
                    }}
                    placeholder={loginIdentifierType === 'email' ? 'harshit@itj.ac.in' : 'harshitseth'}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link has been dispatched to your verified email.');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gradient CTA Button */}
              <button
                type="submit"
                id="submit-login-btn"
                className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-150 bg-gradient-to-r ${activeConfig.gradientBtn}`}
              >
                <span>Sign In to {activeConfig.name.split('/')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  id="goto-signup-btn"
                  onClick={() => onNavigateStep('signup')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Don't have an account? <span className="underline font-semibold">Sign Up</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Welcome / Transition Screen */}
        {currentStep === 'welcome' && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200/80 text-center animate-fade-in">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-sm ${activeConfig.accentBg}`}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${activeConfig.accentPill}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identity Verified</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {activeConfig.welcomeMsg}
            </h1>

            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              {activeConfig.welcomeSub}
            </p>

            {/* Spinner and progress line */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-slate-200 border-t-current rounded-full animate-spin text-slate-800" />
              <button
                onClick={onCompleteAuth}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline mt-2"
              >
                Click here if not redirected automatically
              </button>
            </div>
          </div>
        )}

        {/* Modal: Company / TPO Initial Signup Awaiting Admin Approval */}
        {showSignupPendingNotice && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">One-Time Admin Approval Required</h3>
                  <p className="text-xs text-slate-500">Security & credential validation</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p>
                  Your registration for <span className="font-bold text-slate-900">{fullName}</span> has been queued for Super Admin approval.
                </p>
                <p className="text-slate-700 font-medium">
                  ✓ <span className="text-emerald-700 font-semibold">Important:</span> Once the Administrator approves your initial registration, you can <span className="font-bold text-slate-900">directly log in anytime in the future without asking for approval</span>.
                </p>
                <p className="text-slate-500 text-[11px]">
                  Company job postings also do not require admin approval and will go live directly once your account is active.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => {
                    // Demo fast-track approval
                    const records = loadApprovalRecords();
                    const updated = records.map(r => r.email.toLowerCase() === email.toLowerCase() ? { ...r, status: 'active' as const, approvedAt: 'Just Now' } : r);
                    saveApprovalRecords(updated);
                    setShowSignupPendingNotice(false);
                    onNavigateStep('welcome');
                    setTimeout(() => onCompleteAuth(), 1500);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors text-center"
                >
                  Approve & Login (Fast-Track)
                </button>
                <button
                  onClick={() => {
                    setShowSignupPendingNotice(false);
                    onSelectRole('admin');
                    onNavigateStep('welcome');
                    setTimeout(() => onCompleteAuth(), 1000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors text-center"
                >
                  Switch to Admin View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
