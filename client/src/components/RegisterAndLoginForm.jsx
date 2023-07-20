import { useContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
      toast.success(
        isLoginOrRegister === "register"
          ? "Registration successful!"
          : "Login successful!"
      );
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <ToastContainer />
      <form className="w-100 mx-auto mb-12" onSubmit={handleSubmit}>
        <h1 className="mb-5 text-4xl text-center">
          {isLoginOrRegister === "register"
            ? "Registration Form"
            : "Login Form"}
        </h1>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?
              <button
                className="ml-1"
                onClick={() => setIsLoginOrRegister("login")}
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account?
              <button
                className="ml-1"
                onClick={() => setIsLoginOrRegister("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
