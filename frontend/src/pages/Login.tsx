import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
// import bgImage from '../assets/login_bg.png'; // Will use generated image path

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual login logic
        console.log('Login attempt', { email, password });
        navigate('/dashboard');
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-surface items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-background/90 z-10" />
                <img
                    src="/login_background.png"
                    alt="Branding"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 p-10 text-white">
                    <h1 className="text-5xl font-bold mb-4">Stitch.</h1>
                    <p className="text-xl text-gray-300">Premium Halı Bayi Yönetim Sistemi</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Hoşgeldiniz</h2>
                        <p className="mt-2 text-sm text-text-muted">
                            Lütfen hesabınıza giriş yapın
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full border border-accent bg-surface/50 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="E-posta"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-background px-1 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                                >
                                    E-posta
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="peer w-full border border-accent bg-surface/50 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Şifre"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-background px-1 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                                >
                                    Şifre
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-600 bg-surface/50 text-primary focus:ring-primary"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Beni Hatırla
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary-hover">
                                    Şifremi unuttum?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-primary py-3 px-4 text-sm font-semibold text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-all active:scale-[0.98]"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
