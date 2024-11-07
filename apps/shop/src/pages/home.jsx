import { useNavigate } from 'react-router-dom';
import './home.css';
import { currentUser } from '../session';

const HomePage = () => {
  const navigate = useNavigate();
  const user = currentUser();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Hello World</h1>
      <h2>Welcome {user?.['cognito:username']}</h2>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
