import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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
        "/auth/register",
        formData
      );

      const token = response.data.access_token;

      localStorage.setItem(
        "access_token",
        token
      );

      localStorage.setItem(
        "role",
        formData.role
      );

      if (formData.role === "buyer") {
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
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>

          <div>
            <label>
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength="2"
              maxLength="100"
              required
            />
          </div>


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
              minLength="8"
              maxLength="72"
              required
            />
          </div>


          <div>
            <label>
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="buyer">
                Buyer
              </option>

              <option value="supplier">
                Supplier
              </option>
            </select>
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
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>


        <p>
          Already have an account?
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

      </div>
    </div>
  );
}


export default Register;