import { useState } from "react";
import { useCookies } from "react-cookie"

//here changes in argument
const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogIn, setIsLogin] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)

  console.log("cookies:", cookies)

  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLogIn && password !== confirmPassword) {
      setError('Make sure password match!')
      return
    }

    //HERE CHANGES WHOLE
    try {
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
          setCookie('email', data.email, { path: '/' });
          setCookie('token', data.token, { path: '/' });
          window.location.reload();
      } else {
          setError(data.detail || 'Something went wrong.');
      }
  } catch (err) {
      setError('Error: ' + err.message);
  }
};



    /*
    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
  

    const data = await response.json()
    console.log(data)
    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('email', data.email)
      setCookie('AuthToken', data.token)
    
  
  window.location.reload()
  }

}

*/
    return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form>
            <h2>{isLogIn ? 'Please log in' : 'Please sign up!'}</h2>
            <input 
            type="email" 
            placeholder="email" 
            onChange={(e) => setEmail(e.target.value)}
            />
            <input 
            type="password" 
            placeholder="password" 
            onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogIn && (
            <input 
            type="password" 
            placeholder="confirm passwword"
            onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            )}
            {
              error && <p>{error}</p>
            }
            <input 
            type="submit" 
            className="create" 
            onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}
            />
            {error && <p>{error}</p>}
          </form>

          <div className="auth-options">
            <button 
              onClick={() => setIsLogin(false)}
              style={{
                backgroundColor : !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
            >
              Sign Up
            </button>
            <button 
              onClick={() => setIsLogin(true)}
              style={{
                backgroundColor : isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
            >Login</button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Auth
 