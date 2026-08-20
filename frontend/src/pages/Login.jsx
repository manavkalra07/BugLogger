import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get("invite");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);

            if (inviteToken) {
                navigate(`/invite/${inviteToken}`);
                return;
            }

            navigate("/dashboard");
        }
        catch (error) {
            console.log(error);
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/google",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        credential: credentialResponse.credential
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Google sign-in failed");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);

            if (inviteToken) {
                navigate(`/invite/${inviteToken}`);
                return;
            }

            navigate("/dashboard");
        }
        catch (error) {
            console.log(error);
            setError("Google sign-in failed");
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google sign-in failed. Please try again.");
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-2 md:min-h-screen">
                {/* Left Panel - Branding */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center p-12 text-white">
                    <div className="text-center space-y-8">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 text-2xl font-bold">
                                BL
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                Professional Bug Tracking System
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Track, assign and resolve bugs faster with a secure collaborative workspace.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 pt-8">
                            {["Track Bugs", "Assign Developers", "Upload Screenshots", "Activity Timeline", "Secure Authentication"].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3 justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-blue-200" />
                                    <span className="text-blue-100">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Auth Form */}
                <div className="flex justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        <AuthFormContent
                             email={email}
                            password={password}
                            error={error}
                            loading={loading}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleSubmit={handleSubmit}
                            handleGoogleSuccess={handleGoogleSuccess}
                            handleGoogleError={handleGoogleError}
                            navigate={navigate}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="md:hidden flex flex-col min-h-screen">
                {/* Branding Section */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center p-8 text-white">
                    <div className="text-center space-y-8">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 text-2xl font-bold">
                                BL
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white leading-tight">
                                Professional Bug Tracking System
                            </h1>
                            <p className="text-blue-100 text-base">
                                Track, assign and resolve bugs faster with a secure collaborative workspace.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 pt-4">
                            {["Track Bugs", "Assign Developers", "Upload Screenshots", "Activity Timeline", "Secure Authentication"].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3 justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-blue-200" />
                                    <span className="text-blue-100 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Auth Form Section */}
                <div className="flex-1 flex justify-center items-center p-4">
                    <div className="w-full max-w-md">
                        <AuthFormContent
                             email={email}
                            password={password}
                            error={error}
                            loading={loading}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleSubmit={handleSubmit}
                            handleGoogleSuccess={handleGoogleSuccess}
                            handleGoogleError={handleGoogleError}
                            navigate={navigate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
function AuthFormContent({
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
    handleGoogleSuccess,
    handleGoogleError,
    navigate
}) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-600">Sign in to your account to continue</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                    >
                        <span>{loading ? "Signing in..." : "Sign In"}</span>
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or continue with</span>
                    </div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        width="100%"
                    />
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-slate-600">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                            Create account
                        </button>
                    </p>
                </div>
            </div>
        );
    }

export default Login;