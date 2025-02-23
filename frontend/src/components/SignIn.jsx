import '../styles/Auth.css'

function SignIn() {
  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="auth-button">Sign In</button>
      </form>
    </div>
  )
}

export default SignIn 