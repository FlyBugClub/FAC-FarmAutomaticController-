import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassw from "./components/Auth/ForgotPassw";
import { Dashboard } from "./components/Dashboard/dashboard";
import NewPassw from "./components/Auth/NewPassw";
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Signup/>
        {/* <Dashboard/> */}
      </header>
    </div>
  );
}

export default App;
