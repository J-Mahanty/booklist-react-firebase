import FullPageLoader from '../components/FullPageLoader.jsx';
import {useState} from 'react';
import { auth } from '../firebase/config.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/usersSlice.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';

function LoginPage() {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('login');
  const [error, setError] = useState('');
  const [userCredentials, setUserCredentials] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({id: user.uid, email: user.email}));
    } else {
      dispatch(setUser(null)); 
    }
  })

  function handleCredentials(e){
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
  }

  function handleSignUp(e) {
    e.preventDefault();
    setError("");

    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    .then((userCredential) => {
      dispatch(setUser({id: userCredential.user.uid, email: userCredential.user.email}));
    })
    .catch((error) => {
      setError(error.message);
    });
  }

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    .then((userCredential) => {
      dispatch(setUser({id: userCredential.user.uid, email: userCredential.user.email}));
    })
    .catch((error) => {
      setError(error.message);
    });
  }

  function handlePasswordReset(){
    const email = prompt('Please enter your email');
    sendPasswordResetEmail(auth, email);
    alert('Email sent! Check your inbox or spam and junk folder for instructions to reset your password')
  }

  

  
  return (
    <>
      { isLoading && <FullPageLoader></FullPageLoader> }
      
      <div className="container login-page">
        <section>
          <h1>Welcome to the Book App</h1>
          <p>Login or create an account to continue</p>
          <div className="login-type">
            <button 
              className={`btn ${loginType == 'login' ? 'selected' : ''}`}
              onClick={()=>setLoginType('login')}>
                Login
            </button>
            <button 
              className={`btn ${loginType == 'signup' ? 'selected' : ''}`}
              onClick={()=>setLoginType('signup')}>
                Signup
            </button>
          </div>
          <form className="add-form login">
                <div className="form-control">
                    <label>Email *</label>
                    <input onChange={(e) => {handleCredentials(e)}} type="text" name="email" placeholder="Enter your email" />
                </div>
                <div className="form-control">
                    <label>Password *</label>
                    <input onChange={(e) => {handleCredentials(e)}} type="password" name="password" placeholder="Enter your password" />
                </div>
                {
                  loginType == 'login' ?
                  <button onClick={(e) => {handleLogin(e)}} className="active btn btn-block">Login</button>
                  : 
                  <button onClick={(e) => {handleSignUp(e)}} className="active btn btn-block">Sign Up</button>
                }

                {error &&

                <div className="error">{error}</div>

                }

                <p onClick={handlePasswordReset} className="forgot-password">Forgot Password?</p>
                
            </form>
        </section>
      </div>
    </>
  )
}

export default LoginPage
  