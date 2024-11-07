import { basePath, config } from '../api';

const LoginPage = () => {
  const goHostedUI = async () => {
    const url = config.hostedUiUrl + '/login';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: document.location.origin + basePath + '/return',
      scope: 'openid email phone',
    });
    document.location.href = url + '?' + params.toString();
  };

  return (
    <div className="container">
      <h1>Welcome</h1>
      <button type="submit" onClick={() => goHostedUI()}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
