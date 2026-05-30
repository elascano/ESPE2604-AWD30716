import { useEffect } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface LoginProps {
  user: User | null;
}

export default function Login({ user }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.sessionClosed) {
      toast.error("This session has been closed");
      window.history.replaceState({}, ''); 
    }
  }, [location]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Signed out successfully");
  };

  const handleLogin = async (provider: any, providerName: string) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/menu");
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        toast.warning("Email exists. Please sign in with Google first to link your account.");
      } else {
        toast.error(`Authentication error with ${providerName}`);
      }
    }
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '450px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Confirm</h2>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
            You are currently logged in as <strong style={{color: '#0f172a'}}>{user.displayName || user.email}</strong>. You need to log out before entering with a different user.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => navigate('/menu')} style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: '#334155', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Go to Dashboard
            </button>
            <button onClick={handleLogout} style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: '#ffffff', backgroundColor: '#024cca', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', backgroundColor: '#e0f2fe', borderRadius: '50%', marginBottom: '20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          Physical Therapy Clinic
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
          Patient Management & Rehabilitation Portal
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => handleLogin(googleProvider, "Google")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '12px', fontSize: '15px', fontWeight: 500, color: '#334155', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.216 1.414 15.48 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.79-.085-1.4-.197-1.905H12.24Z"/></svg>
            Continue with Google
          </button>
          <button onClick={() => handleLogin(githubProvider, "GitHub")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '12px', fontSize: '15px', fontWeight: 500, color: '#ffffff', backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12Z"/></svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
