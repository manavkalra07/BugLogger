import { CheckCircle2 } from "lucide-react";

function AuthBranding() {
    const features = [
        "Track Bugs",
        "Assign Developers",
        "Upload Screenshots",
        "Activity Timeline",
        "Secure Authentication"
    ];

    return (
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
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 justify-center">
                        <CheckCircle2 className="w-5 h-5 text-blue-200" />
                        <span className="text-blue-100">{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AuthBranding;
