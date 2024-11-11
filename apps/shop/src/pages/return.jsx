import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { basePath, oauth2Token } from '../api';
import shopApi from '../shopApi';
import { Helmet } from 'react-helmet';

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
        shopApi.getProfile().then(() => {
          window.location.href = `${basePath}/home`;
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Return Page</title>
        <meta name="description" content="This is a return page" />
      </Helmet>
      <h1>return</h1>
    </>
  );
};

export default ReturnPage;
