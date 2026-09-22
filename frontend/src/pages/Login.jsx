import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token && role === "buyer") {
      navigate("/buyer", { replace: true });
    }

    if (token && role === "supplier") {
      navigate("/supplier", { replace: true });
    }
  }, [navigate]);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const token = response.data.access_token;

      localStorage.setItem(
        "access_token",
        token
      );

      const tokenPayload = JSON.parse(
        atob(token.split(".")[1])
      );

      const role = tokenPayload.role;

      if (
        role !== "buyer" &&
        role !== "supplier"
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");

        setError("Invalid user role.");
        return;
      }

      localStorage.setItem("role", role);

      if (role === "buyer") {
        navigate("/buyer", {
          replace: true,
        });
      } else {
        navigate("/supplier", {
          replace: true,
        });
      }

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div>
            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


          <div>
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p>
          Don't have an account?
        </p>

        <button
          type="button"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>

      </div>
    </div>
  );
}


export default Login;