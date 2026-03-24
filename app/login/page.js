"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Logged in successfully');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-[#121212] p-8 sm:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5 dark:shadow-none transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10 dark:shadow-white/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Admin Access</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Please sign in to manage products</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1a1a] focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1a1a] focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-6 shadow-xl shadow-black/10 dark:shadow-white/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
