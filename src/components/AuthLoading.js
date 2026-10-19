import Spinner from './Spinner';

const AuthLoading = () => (
  <div className="auth-loading">
    <Spinner />
    <p>
      The free server may take up to 45 seconds to start. Thanks for your
      patience while we log you in!
    </p>
  </div>
);

export default AuthLoading;
