import "./App.css";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext";
import Routes from "./components/Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:8080";
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
