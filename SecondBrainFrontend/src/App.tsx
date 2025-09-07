import { SignUp } from "./pages/Signup"
import Dashboard from "./pages/dashboard"
import { Signin } from "./pages/Signin"
import {BrowserRouter, Routes, Route} from "react-router-dom"
function App() {
  return <BrowserRouter>
  <Routes>
    <Route path = "/signup" element = {<SignUp/>} />
    <Route path = "/signin" element = {<Signin/>} />
    <Route path = "/dashboard" element = {<Dashboard/>} />
    </Routes>
    </BrowserRouter>
}

export default App
