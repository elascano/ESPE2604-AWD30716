import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";
import { User } from "firebase/auth";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Signed out successfully");
  };

  const providers = user.providerData.map(p => p.providerId);
  const hasGoogle = providers.includes('google.com');
  const hasGithub = providers.includes('github.com');
  const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#0ea5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>+</div>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '18px' }}>PhysioControl</span>
            </div>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#0ea5e9', borderRadius: '4px', marginLeft: '-24px' }}></div>
              Dashboard
            </div>
          </div>
        </div>
        
        <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Logged in as:</p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.displayName || 'Unknown User'}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Patient</p>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <nav style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 40px', position: 'relative' }}>
          
          <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>{user.displayName?.split(' ')[0] || 'Profile'}</span>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0f2fe' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initial}</div>
            )}
          </div>

          {dropdownOpen && (
            <div style={{ position: 'absolute', top: '75px', right: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '280px', zIndex: 10 }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{user.displayName || 'User'}</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</p>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {hasGoogle && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.216 1.414 15.48 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.79-.085-1.4-.197-1.905H12.24Z"/></svg>
                      Google
                    </div>
                  )}
                  {hasGithub && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12Z"/></svg>
                      GitHub
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: '8px' }}>
                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', fontSize: '14px', color: '#ef4444', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>

        <main style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Welcome, {user.displayName?.split(' ')[0] || 'Patient'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
            Manage your appointments and therapies from here
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>Upcoming Appointments</h3>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#0284c7' }}>0</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>Available Therapies</h3>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>5</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
