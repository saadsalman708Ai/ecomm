import React, { useState, useEffect } from 'react';
import { HomeButton } from '../../../components/navbar/HomeButton';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, registerWithEmail, checkEmailExists, resetPassword } from '../../../lib/firebase/auth';
import { getUserDoc, createUserDoc } from '../../../lib/firebase/firestore';
import { Eye, EyeOff, ArrowLeft, Pencil } from 'lucide-react';

type AuthMode = 'entry' | 'login' | 'signup' | 'forgot' | 'sent';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('entry');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'sent' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePostLogin = async (uid: string, resultEmail: string | null) => {
    let userDoc = await getUserDoc(uid);
    if (!userDoc && resultEmail) {
      userDoc = await createUserDoc(uid, resultEmail);
    }
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const exists = await checkEmailExists(email);
      setMode(exists ? 'login' : 'signup');
    } catch (err: any) {
      console.error(err);
      // Fallback if fetchSignInMethodsForEmail fails (e.g. enumeration protection)
      setMode('login');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await loginWithEmail(email, password);
      await handlePostLogin(user.uid, user.email);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password.');
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await registerWithEmail(email, password);
      await handlePostLogin(user.uid, user.email);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
        setMode('login');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setMode('sent');
      setResendTimer(120);
    } catch (err) {
      setError('Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      setLoading(true);
      const user = await loginWithGoogle();
      await handlePostLogin(user.uid, user.email);
    } catch (err) {
      setError('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
      <div className="w-full max-w-md mx-auto relative z-10 flex">
        <HomeButton />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto pb-20 px-4">
        <div className="bg-card w-full p-8 sm:p-12 rounded-2xl shadow-sm border border-border">
        
        {mode === 'entry' && (
          <div className="w-full">
            <h1 className="text-3xl font-bold text-center mb-12 text-foreground tracking-tight">Log in or sign up</h1>
            
            {error && (
               <div className="bg-error/10 text-error p-3 rounded-xl mb-4 text-sm font-medium text-center">
                 {error}
               </div>
            )}

            <button 
              type="button" onClick={signInGoogle} disabled={loading}
              className="w-full bg-white border border-border text-foreground hover:bg-gray-50 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-foreground-muted text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleEntrySubmit} className="flex flex-col gap-5">
              <div className="relative">
                <input 
                   id="emailEntry"
                   type="email" required value={email} onChange={e => setEmail(e.target.value)}
                   placeholder=" "
                   className="block peer w-full px-6 py-4 bg-white border border-border shadow-sm rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                />
                <label 
                   htmlFor="emailEntry" 
                   className="absolute text-foreground-muted duration-300 transform -translate-y-1/2 scale-[0.85] top-0 left-5 z-10 origin-[0] bg-white px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:font-medium peer-focus:text-primary pointer-events-none"
                >
                  Email address
                </label>
              </div>
              <button 
                type="submit" disabled={loading || !email}
                className="w-full bg-primary text-white py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <div className="w-full">
            <h1 className="text-3xl font-bold text-center mb-10 text-foreground tracking-tight">
              {mode === 'login' ? 'Enter your password' : 'Create a password'}
            </h1>
            
            {error && (
               <div className="bg-error/10 text-error p-3 rounded-xl mb-4 text-sm font-medium text-center">
                 {error}
               </div>
            )}

            <form onSubmit={mode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="flex flex-col gap-5">
              <div className="relative border border-border shadow-sm rounded-full bg-gray-50/50 px-6 py-3 flex items-center justify-between overflow-hidden">
                <div className="flex flex-col min-w-0 pr-4">
                   <span className="text-[11px] text-foreground-muted font-semibold uppercase tracking-wider mb-0.5">Email</span>
                   <span className="text-sm font-medium text-foreground truncate">{email}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setMode('entry')}
                  className="text-primary text-sm font-bold tracking-wide hover:underline flex items-center flex-shrink-0"
                >
                  Edit
                  <Pencil size={14} className="ml-1" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative items-center">
                  <input 
                     id="passwordInput"
                     type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                     placeholder=" "
                     className="block peer w-full pl-6 pr-12 py-4 bg-white border border-border shadow-sm rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                  />
                  <label 
                     htmlFor="passwordInput" 
                     className="absolute text-foreground-muted duration-300 transform -translate-y-1/2 scale-[0.85] top-0 left-5 z-10 origin-[0] bg-white px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:font-medium peer-focus:text-primary pointer-events-none"
                  >
                    Password
                  </label>
                  <button 
                    type="button" 
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors z-20" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="ml-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setError('');
                        setMode('forgot');
                      }}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <button 
                type="submit" disabled={loading || !password}
                className="w-full bg-primary text-white py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Continuing...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Reset password</h1>
            <p className="text-foreground-muted mb-10 leading-relaxed">
              Click 'Get Email', We will send a password reset link to<br/>
              <span className="font-medium text-foreground">{email}</span>
            </p>
            
            {error && (
               <div className="bg-error/10 text-error p-3 rounded-xl mb-4 text-sm font-medium text-center">
                 {error}
               </div>
            )}

            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-6">
              <button 
                type="submit" disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Get Email'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="text-foreground text-sm font-bold hover:underline"
              >
                Back to login
              </button>
            </form>
          </div>
        )}

        {mode === 'sent' && (
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Check your inbox</h1>
            <p className="text-foreground-muted mb-10 leading-relaxed">
              We just sent a password reset link to<br/>
              <span className="font-medium text-foreground">{email}</span>
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => handleForgotSubmit({ preventDefault: () => {} } as any)}
                  disabled={loading || resendTimer > 0}
                  className={`text-sm font-bold transition-colors ${resendTimer > 0 ? 'text-primary/50 cursor-not-allowed' : 'text-primary hover:underline'}`}
                >
                  {loading ? 'Sending...' : 'Resend email link'}
                </button>
                {resendTimer > 0 && (
                  <span className="text-xs text-foreground-muted font-medium">
                    Resend available in {formatTime(resendTimer)}
                  </span>
                )}
              </div>

              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-foreground-muted text-xs font-bold uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="w-full bg-transparent border border-border text-foreground hover:bg-gray-50 py-3.5 rounded-full font-bold transition-all shadow-sm"
              >
                Continue to login
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
