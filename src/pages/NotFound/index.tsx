import logo from '/logo.svg'
import './index.css'

function NotFound() {
  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Brainto logo" />
      </div>
      <h1>Ups...this is not the page you are looking for</h1>
    </>
  )
}

export default NotFound
