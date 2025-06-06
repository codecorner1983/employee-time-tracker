import React, { useEffect } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Employee } from '../types';

interface GoogleSignInProps {
  onLogin: (employee: Employee) => void;
}

export default function GoogleSignIn({ onLogin }: GoogleSignInProps) {
  const { isLoaded, isSignedIn, user, signIn, convertToEmployee } = useGoogleAuth();

  useEffect(() => {
    if (isLoaded) {
      signIn('google-signin-button');
    }
  }, [isLoaded, signIn]);

  useEffect(() => {
    if (isSignedIn && user) {
      const employee = convertToEmployee(user);
      onLogin(employee);
    }
  }, [isSignedIn, user, convertToEmployee, onLogin]);

  if (!isLoaded) {
    return (
      <div className="w-full py-3 px-4 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading Google Sign-In...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
}