import type { UserData } from './types';

interface UserListProps {
  users: UserData[];
}

export const UserList = ({ users }: UserListProps) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>User List</h3>
      {users.length === 0 ? (
        <p>No users registered yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>Last Name</th>
                <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>Username</th>
                <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>RUC</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id || index}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.lastname || '-'}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.username || '-'}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.ruc || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};