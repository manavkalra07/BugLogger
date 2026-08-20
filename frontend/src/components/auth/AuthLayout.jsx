function AuthLayout({ children, brandingContent }) {
    return (
        <div className="min-h-screen bg-slate-100">
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-2 md:min-h-screen">
                {/* Left Panel - Branding */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center p-12 text-white">
                    {brandingContent}
                </div>

                {/* Right Panel - Auth Form */}
                <div className="flex justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="md:hidden flex flex-col min-h-screen">
                {/* Branding Section */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center p-8 text-white">
                    {brandingContent}
                </div>

                {/* Auth Form Section */}
                <div className="flex-1 flex justify-center items-center p-4">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
