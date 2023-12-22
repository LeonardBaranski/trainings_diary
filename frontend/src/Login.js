import React from 'react';
import { GoogleLogin } from 'react-google-login';

const responseGoogle = (response) => {
  console.log(response);
  // Send token to backend for verification
}

const Login = () => {
  return (
    <GoogleLogin
      clientId="42379345688-mqd6d271fdaa2scqmjju6cosobe81ehg.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default Login;
