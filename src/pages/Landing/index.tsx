import logo from '/logo.svg'
import './index.css'

function Landing() {
  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Brainto logo" />
      </div>
      <h1>Welcome to Brainto</h1>
    </>
  )
}

export default Landing
