import { useState, useEffect } from 'react';
import { GoogleUser, Employee } from '../types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

export function useGoogleAuth() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });
        setIsLoaded(true);
      }
    };

    if (window.google) {
      initializeGoogleAuth();
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener('load', initializeGoogleAuth);
      }
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const googleUser: GoogleUser = {
        sub: payload.sub,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        email: payload.email,
        email_verified: payload.email_verified,
        locale: payload.locale,
      };
      
      setUser(googleUser);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Error parsing Google credential:', error);
    }
  };

  const signIn = (elementId: string) => {
    if (window.google && isLoaded) {
      const element = document.getElementById(elementId);
      if (element) {
        window.google.accounts.id.renderButton(element, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    }
  };

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const convertToEmployee = (googleUser: GoogleUser): Employee => {
    // Determine department based on email domain or other logic
    const getDepartment = (email: string) => {
      if (email.includes('eng') || email.includes('dev')) return 'Engineering';
      if (email.includes('design')) return 'Design';
      if (email.includes('marketing')) return 'Marketing';
      if (email.includes('sales')) return 'Sales';
      return 'General';
    };

    return {
      id: googleUser.sub,
      name: googleUser.name,
      email: googleUser.email,
      department: getDepartment(googleUser.email),
      avatar: googleUser.picture,
      isLoggedIn: true,
      loginTime: new Date(),
      totalWorkTime: 0,
      totalBreakTime: 0,
      googleId: googleUser.sub,
      isGoogleAuth: true,
    };
  };

  return {
    isLoaded,
    isSignedIn,
    user,
    signIn,
    signOut,
    convertToEmployee,
  };
}