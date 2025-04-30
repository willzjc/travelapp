import { useAuth } from '../context/AuthContext';

function YourHeaderOrNavComponent() {
  const { user } = useAuth();
  
  return (
    <div>
      {user ? (
        <span>Signed in as {user.displayName || 'User'}</span>
      ) : (
        <span>Not signed in</span>
      )}
    </div>
  );
}

export default YourHeaderOrNavComponent;