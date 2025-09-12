import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

export default function AuthScreen(): React.ReactElement {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => setIsLoginView(!isLoginView);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {isLoginView ? (
                    <LoginScreen onToggleView={toggleView} />
                ) : (
                    <RegisterScreen onToggleView={toggleView} />
                )}
            </div>
        </div>
    );
}