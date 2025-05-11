'use client';

import Section from './Section';
import { useContest, ContestState } from '@/contexts/ContestContext';

export default function AuthSection() {
  const { contestState } = useContest();
  
  // Determine what form to show based on state
  const showLoginForm = contestState === ContestState.STARTED;
  
  return (
    <Section id="auth">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {showLoginForm ? 'Login' : 'Registration'}
        </h2>
        
        {showLoginForm ? (
          <LoginForm />
        ) : (
          <RegistrationForm disabled={contestState === ContestState.NOT_STARTED} />
        )}
      </div>
    </Section>
  );
}

function LoginForm() {
  return (
    <form className="w-full max-w-md p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm">
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-sm">Email Address</label>
        <input 
          type="email" 
          id="email" 
          className="w-full p-2 rounded bg-black/50 border border-white/20 focus:border-white outline-none" 
          placeholder="youremail@example.com"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-sm">Password</label>
        <input 
          type="password" 
          id="password" 
          className="w-full p-2 rounded bg-black/50 border border-white/20 focus:border-white outline-none" 
          placeholder="••••••••"
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors"
      >
        Login
      </button>
    </form>
  );
}

function RegistrationForm({ disabled = false }: { disabled?: boolean }) {
  return (
    <form className={`w-full max-w-md p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="mb-4">
        <label htmlFor="teamName" className="block mb-2 text-sm">Team Name</label>
        <input 
          type="text" 
          id="teamName" 
          className="w-full p-2 rounded bg-black/50 border border-white/20 focus:border-white outline-none" 
          placeholder="Cyber Wizards"
          disabled={disabled}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-sm">Email Address</label>
        <input 
          type="email" 
          id="email" 
          className="w-full p-2 rounded bg-black/50 border border-white/20 focus:border-white outline-none" 
          placeholder="youremail@example.com"
          disabled={disabled}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 text-sm">Password</label>
        <input 
          type="password" 
          id="password" 
          className="w-full p-2 rounded bg-black/50 border border-white/20 focus:border-white outline-none" 
          placeholder="••••••••"
          disabled={disabled}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block mb-2 text-sm">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          className="w-full p-2 rounded bg-black/50 border border-white/20 focus:border-white outline-none" 
          placeholder="••••••••"
          disabled={disabled}
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors"
        disabled={disabled}
      >
        Register Team
      </button>
      
      {disabled && (
        <p className="mt-4 text-center text-sm text-white/70">
          Registration is not open yet. Check back soon!
        </p>
      )}
    </form>
  );
} 