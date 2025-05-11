'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Section from '../common/Section';
import { 
  useIsContestStarted, 
  useIsContestNotStarted 
} from '@/contexts/ContestContext';
import { register } from '@/actions/auth/register';
import { login } from '@/actions/auth/login';
import RegistrationSuccessModal from '../common/RegistrationSuccessModal';
import LoginSuccessModal from '../common/LoginSuccessModal';
import { AnimatePresence } from 'motion/react';
import { getSession } from '@/actions/auth/getSession';
import { getButtonClasses, getInputClasses, getFormGroupClasses, getLabelClasses } from '@/lib/ui-utils';

export default function AuthSection() {
  const isStarted = useIsContestStarted();
  const isNotStarted = useIsContestNotStarted();
  
  return (
    <Section id="auth">
      <div className="flex flex-col items-center justify-center h-full w-full px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
          {isStarted ? 'Login' : 'Registration'}
        </h2>
        
        {isStarted ? (
          <LoginForm />
        ) : (
          <RegistrationForm disabled={isNotStarted} />
        )}
      </div>
    </Section>
  );
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      console.log(`Submitting login for email: ${email}`);
      // Call the login server action
      const result = await login({ email, password });
      console.log('Login result:', result);
      
      if (result.success) {
        // Use team name directly from the result
        setTeamName(result.team?.name || 'Your Team');
        setShowSuccessModal(true);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-xl md:max-w-2xl p-4 md:p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm"
      >
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div className={getFormGroupClasses('md')}>
          <label htmlFor="email" className={getLabelClasses('md')}>Email Address</label>
          <input 
            type="email" 
            id="email" 
            className={getInputClasses('default')} 
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className={getFormGroupClasses('md')}>
          <label htmlFor="password" className={getLabelClasses('md')}>Password</label>
          <input 
            type="password" 
            id="password" 
            className={getInputClasses('default')} 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={getButtonClasses('primary', 'md', true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <AnimatePresence>
        {showSuccessModal && (
          <LoginSuccessModal 
            isOpen={showSuccessModal}
            teamName={teamName}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function RegistrationForm({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredTeamName, setRegisteredTeamName] = useState('');
  
  const [members, setMembers] = useState([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' }
  ]);
  
  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', email: '' }]);
      setActiveSlide(members.length);
    }
  };
  
  const removeMember = (index: number) => {
    if (members.length > 3) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
      setActiveSlide(Math.min(activeSlide, newMembers.length - 1));
    }
  };
  
  const updateMember = (index: number, field: 'name' | 'email', value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!members[0].name || !members[0].email) {
      setError('Team leader information is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call the register server action with all members
      const result = await register({
        teamName: teamName.trim(),
        leaderName: members[0].name.trim(),
        email: members[0].email.trim(),
        password: password,
        members: members
      });
      
      if (result.success) {
        setRegisteredTeamName(teamName);
        setShowSuccessModal(true);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className={`w-full max-w-xl md:max-w-2xl p-4 md:p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {/* Team Information */}
        <div className={getFormGroupClasses('md')}>
          <label htmlFor="teamName" className={getLabelClasses('md')}>Team Name</label>
          <input 
            type="text" 
            id="teamName" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className={getInputClasses('default')}
            placeholder="Cyber Wizards"
            disabled={disabled || isSubmitting}
            required
          />
        </div>
        
        <div className={getFormGroupClasses('md')}>
          <label htmlFor="password" className={getLabelClasses('md')}>Team Password</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={getInputClasses('default')}
            placeholder="••••••••"
            disabled={disabled || isSubmitting}
            required
            minLength={6}
          />
        </div>
        
        <div className={getFormGroupClasses('md')}>
          <label htmlFor="confirmPassword" className={getLabelClasses('md')}>Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={getInputClasses('default')}
            placeholder="••••••••"
            disabled={disabled || isSubmitting}
            required
          />
        </div>
        
        {/* Member Slideshow */}
        <div className={getFormGroupClasses('md')}>
          <div className="flex justify-between items-center mb-2">
            <label className={getLabelClasses('md')}>Team Members ({members.length})</label>
            <div className="flex gap-1 md:gap-2">
              {members.length < 5 && (
                <button 
                  type="button" 
                  onClick={addMember}
                  className={getButtonClasses('secondary', 'sm')}
                  disabled={disabled || isSubmitting}
                >
                  Add Member
                </button>
              )}
              {members.length > 3 && activeSlide > 0 && (
                <button 
                  type="button" 
                  onClick={() => removeMember(activeSlide)}
                  className={getButtonClasses('danger', 'sm')}
                  disabled={disabled || isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          
          {/* Member Card */}
          <div className="bg-black/20 rounded-lg p-3 md:p-4 border border-white/10 mb-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs md:text-sm font-semibold">
                {activeSlide === 0 ? 'Team Leader' : `Member ${activeSlide + 1}`}
              </h3>
              
              {/* Card Navigation */}
              <div className="flex gap-1 md:gap-2 items-center">
                <button 
                  type="button" 
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  className={getButtonClasses('outline', 'sm')}
                  disabled={activeSlide === 0 || disabled || isSubmitting}
                >
                  &larr;
                </button>
                <span className="text-[10px] md:text-xs text-center py-0.5 md:py-1 min-w-[30px] md:min-w-[40px]">
                  {activeSlide + 1} / {members.length}
                </span>
                <button 
                  type="button" 
                  onClick={() => setActiveSlide(Math.min(members.length - 1, activeSlide + 1))}
                  className={getButtonClasses('outline', 'sm')}
                  disabled={activeSlide === members.length - 1 || disabled || isSubmitting}
                >
                  &rarr;
                </button>
              </div>
            </div>
            
            {/* Member Form */}
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <div>
                <label className={getLabelClasses('sm')}>Name</label>
                <input 
                  type="text" 
                  className={getInputClasses('default')}
                  placeholder="Full Name"
                  value={members[activeSlide].name}
                  onChange={(e) => updateMember(activeSlide, 'name', e.target.value)}
                  disabled={disabled || isSubmitting}
                  required={activeSlide === 0}
                />
              </div>
              <div>
                <label className={getLabelClasses('sm')}>Student Email</label>
                <input 
                  type="email" 
                  className={getInputClasses('default')}
                  placeholder="student@university.edu"
                  value={members[activeSlide].email}
                  onChange={(e) => updateMember(activeSlide, 'email', e.target.value)}
                  disabled={disabled || isSubmitting}
                  required={activeSlide === 0}
                />
              </div>
            </div>
          </div>
          
          {/* Member Indicator Dots */}
          <div className="flex justify-center gap-1 mt-2">
            {members.map((_, index) => (
              <button 
                key={index} 
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${activeSlide === index ? 'bg-white' : 'bg-white/30'}`}
                disabled={disabled || isSubmitting}
              />
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className={getButtonClasses('primary', 'md', true)}
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Register Team'}
        </button>
      </form>
      
      <AnimatePresence>
        {showSuccessModal && (
          <RegistrationSuccessModal
            isOpen={showSuccessModal}
            teamName={registeredTeamName}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
} 