import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { basePath, oauth2Token } from '../api';

const ReturnPage = () => {
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('code')) {
      const code = searchParams.get('code');
      // console.log('Code: ', code);
      oauth2Token(code).then((response) => {
        // navigate("/home");
        if (response) {
          sessionStorage.setItem('idToken', response.id_token || '');
          sessionStorage.setItem('accessToken', response.access_token || '');
          sessionStorage.setItem('refreshToken', response.refresh_token || '');
        }

        document.location.href = `${basePath}/home`;
      });
    }
  }, [searchParams]);

  return <h1>return</h1>;
};

export default ReturnPage;
