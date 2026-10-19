import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalCtx } from '../App';
import AuthLoading from '../components/AuthLoading';

const Signup = (props) => {
  const { gState, setGState } = useContext(GlobalCtx);
  const { url } = gState;

  const blank = {
    username: '',
    password: '',
    email: '',
  };

  const [form, setForm] = useState(blank);
  const [errorText, setErrorText] = useState('');
  const [submit, setSubmit] = useState(
    <input type="submit" value="Sign Up" id="create-account" />,
  );

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password, email } = form;
    if (form.username.includes(' ')) {
      setErrorText('Username cannot have spaces');
    } else {
      let accountCreated = false;
      setErrorText('');
      setSubmit(<AuthLoading />);
      fetch(`${url}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      })
        .then((response) => response.json())
        .then((data) => {
          setForm(blank);
          if (data.error) {
            setErrorText(
              'There is already an account with that username. Please choose another one.',
            );
            setSubmit(
              <input type="submit" value="Sign Up" id="create-account" />,
            );
          } else {
            accountCreated = true;
            return fetch(`${url}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
            })
              .then((response) => response.json())
              .then((authData) => {
                if (authData.error || !authData.token) {
                  props.history.push({
                    pathname: '/login',
                    state: {
                      message:
                        'Your account was created, but automatic sign-in failed. Please log in.',
                    },
                  });
                  return;
                }

                localStorage.setItem('token', JSON.stringify(authData));
                localStorage.setItem('user', authData.username);
                setGState({ ...gState, token: authData.token });
                setForm(blank);
                props.history.push('/');
              });
          }
        })
        .catch(() => {
          if (accountCreated) {
            props.history.push({
              pathname: '/login',
              state: {
                message:
                  'Your account was created, but automatic sign-in failed. Please log in.',
              },
            });
            return;
          }

          setErrorText(
            'Unable to create your account right now. Please try again.',
          );
          setSubmit(
            <input type="submit" value="Sign Up" id="create-account" />,
          );
        });
    }
  };

  const preventSpace = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <>
      <section id="account-form">
        <p id="error-text">{errorText}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            onKeyDown={preventSpace}
            minLength="3"
            maxLength="15"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            minLength="3"
            maxLength="30"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            maxLength="256"
          />
          {submit}
        </form>
      </section>
      <div id="form-bottom">
        <p>Have an account?</p>
        <Link to="/login">
          <p id="margin-space">Log in</p>
        </Link>
      </div>
    </>
  );
};

export default Signup;
