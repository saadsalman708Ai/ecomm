import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../lib/firebase/config';

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center text-foreground-muted">
        Please <a href="/login" className="text-primary underline">login</a> to view your profile.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>
      
      <div className="bg-white border border-border rounded-2xl shadow-sm p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground-muted mb-1">Email</label>
          <div className="text-lg font-medium text-foreground">{user.email}</div>
        </div>
        
        {isAdmin && (
          <div className="mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Admin Account</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <button 
          onClick={handleLogout}
          className="w-full md:w-auto bg-error text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Log Out
        </button>
        
        <button 
          onClick={() => navigate('/contact')}
          className="w-full md:w-auto bg-white border border-border text-foreground px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
