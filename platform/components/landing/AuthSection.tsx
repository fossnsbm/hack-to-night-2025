'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';

import Section from '@/components/common/Section';
import RegistrationSuccessModal from '@/components/landing/RegistrationSuccessModal';
import LoginSuccessModal from '@/components/landing/LoginSuccessModal';
import { useIsContestStarted, useIsRegistrationDisabled } from '@/components/contexts/ContestContext';
import { useAuth } from '@/components/contexts/AuthContext';
import { login, register } from '@/actions/auth';
import { getButtonClasses, getInputClasses, getFormGroupClasses, getLabelClasses } from '@/lib/client-utils';

export default function AuthSection() {
    const isStarted = useIsContestStarted();
    const isRegistrationDisabled = useIsRegistrationDisabled();

    return (
        <Section id="auth">
            <div className="flex flex-col items-center justify-center h-full w-full px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
                    {isStarted ? 'Login' : 'Registration'}
                </h2>

                {isStarted ? (
                    <LoginForm />
                ) : (
                    <RegistrationForm disabled={isRegistrationDisabled} />
                )}
            </div>
        </Section>
    );
}

function LoginForm() {
    const { team, saveToken } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

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

            const result = await login({ email, password });

            if (result.success) {
                saveToken(result.token!)
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
                {showSuccessModal && team && (
                    <LoginSuccessModal
                        isOpen={showSuccessModal}
                        teamName={team.name}
                        onClose={() => setShowSuccessModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function RegistrationForm({ disabled = false }: { disabled?: boolean }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [teamName, setTeamName] = useState('');
    const [teamContactNo, setTeamContactNo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const validateEmail = (email: string): boolean => {
        const emailRegex = /.+@students\.nsbm\.ac\.lk$/;
        return emailRegex.test(email.trim().toLowerCase());
    };

    const validateTeamContactNo = (contactNo: string): boolean => {
        const phoneRegex = /^(?:0)?(7[01245678]\d{7})$/;
        return phoneRegex.test(contactNo.trim());
    };

    const validateMemberEmails = (): { valid: boolean, errorMsg?: string } => {

        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (member.email && !validateEmail(member.email)) {
                return {
                    valid: false,
                    errorMsg: `Email for ${i === 0 ? 'Team Leader' : `Member ${i + 1}`} must end with @students.nsbm.ac.lk`
                };
            }
        }
        return { valid: true };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!teamName.trim()) {
            setError('Team name is required');
            return;
        }

        if (!teamContactNo.trim()) {
            setError('Team contact number is required');
            return;
        }

        if (!validateTeamContactNo(teamContactNo)) {
            setError('Invalid team contact number format. Use 07XXXXXXXX');
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


        const emailValidation = validateMemberEmails();
        if (!emailValidation.valid) {
            setError(emailValidation.errorMsg || 'Invalid email format');
            return;
        }


        const memberEmails = members
            .map(member => member.email.trim().toLowerCase())
            .filter(email => email !== '');

        const uniqueMemberEmails = new Set(memberEmails);
        if (memberEmails.length !== uniqueMemberEmails.size) {
            setError('Duplicate member emails are not allowed. Please ensure each member has a unique email.');


            return;
        }

        try {
            setIsSubmitting(true);

            const result = await register({
                name: teamName.trim(),
                contactNo: teamContactNo.trim(),
                password: password,
                members: members,
            });

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                setError(result.error || 'Registration failed. Please try again.');

                if (result.error?.includes("Email") && result.error?.includes("is already registered")) {

                    const emailInError = result.error.match(/Email\s+([^\s]+)\s+is already registered/);
                    if (emailInError && emailInError[1]) {
                        const problematicEmail = emailInError[1];
                        const memberIndex = members.findIndex(m => m.email === problematicEmail);
                        if (memberIndex !== -1) {
                            setActiveSlide(memberIndex);
                        }
                    }
                }
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
                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

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
                    <label htmlFor="teamContactNo" className={getLabelClasses('md')}>Team Contact No.</label>
                    <input
                        type="tel"
                        id="teamContactNo"
                        value={teamContactNo}
                        onChange={(e) => setTeamContactNo(e.target.value)}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        className={`${getInputClasses('default')} ${(teamContactNo && !validateTeamContactNo(teamContactNo) && error.includes('contact number'))
                            ? 'border-red-500 bg-red-900/20'
                            : ''
                            }`}
                        placeholder="07XXXXXXXX"
                        disabled={disabled || isSubmitting}
                        required
                    />
                    {teamContactNo && !validateTeamContactNo(teamContactNo) && error.includes('contact number') && (
                        <p className="mt-1 text-xs text-red-500">Invalid team contact number format. Use 07XXXXXXXX</p>
                    )}
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
                        className={`${getInputClasses('default')} ${confirmPassword && password !== confirmPassword ? 'border-red-500 bg-red-900/20' : ''}`}
                        placeholder="••••••••"
                        disabled={disabled || isSubmitting}
                        required
                    />
                    {confirmPassword && password !== confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                    )}
                </div>

                <div className={getFormGroupClasses('md')}>
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <label className={getLabelClasses('md')}>Team Members</label>
                            <p className="text-xs text-gray-400 mt-0.5">Maximum 5 members allowed</p>
                        </div>
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

                    <div className="bg-black/20 rounded-lg p-3 md:p-4 border border-white/10 mb-2">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs md:text-sm font-semibold">
                                {activeSlide === 0 ? 'Team Leader' : `Member ${activeSlide + 1}`}
                            </h3>

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
                                    className={`${getInputClasses('default')} ${(members[activeSlide].email && !validateEmail(members[activeSlide].email)) ||
                                        (error && error.includes(members[activeSlide].email))
                                        ? 'border-red-500 bg-red-900/20'
                                        : ''
                                        }`}
                                    placeholder="student@students.nsbm.ac.lk"
                                    value={members[activeSlide].email}
                                    onChange={(e) => updateMember(activeSlide, 'email', e.target.value)}
                                    disabled={disabled || isSubmitting}
                                    required={activeSlide === 0}
                                />
                                {members[activeSlide].email && !validateEmail(members[activeSlide].email) && (
                                    <p className="mt-1 text-xs text-red-500">Email must end with @students.nsbm.ac.lk</p>
                                )}
                                {error && error.includes(members[activeSlide].email) && (
                                    <p className="mt-1 text-xs text-red-500">This email is already registered</p>
                                )}
                            </div>
                        </div>
                    </div>

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
                        teamName={teamName}
                        onClose={() => setShowSuccessModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
} 
