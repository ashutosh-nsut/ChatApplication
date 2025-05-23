import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';


const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("🔹 Sending login data:", user);

    try {
        const res = await axios.post("https://chatapplication-ih32.onrender.com/api/v1/user/login", user, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Needed for cookies
        });

        if (res.data && res.data.success) {
            dispatch(setAuthUser(res.data.user));
            toast.success("Login successful!");
            navigate("/");
        } else {
            toast.error(res.data.message || "Invalid credentials!");
        }
    } catch (error) {
        // Improved error handling
        if (error.response) {
            console.error("❌ Login failed:", error.response.data);
            toast.error(error.response.data.message || "Login failed. Please try again.");
        } else if (error.request) {
            console.error("❌ No response from server:", error.request);
            toast.error("No response from the server. Please check your connection.");
        } else {
            console.error("❌ Error setting up request:", error.message);
            toast.error("There was an error setting up the request.");
        }
    }
};


  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Login</h1>
        <form onSubmit={onSubmitHandler}>

          <div>
            <label className='label p-2'><span className='text-base label-text'>Username</span></label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username'
              required
            />
          </div>

          <div>
            <label className='label p-2'><span className='text-base label-text'>Password</span></label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password'
              required
            />
          </div>

          <p className='text-center my-2'>Don't have an account? <Link to="/signup">Signup</Link></p>

          <div>
            <button type="submit" className='btn btn-block btn-sm mt-2 border border-slate-700'>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
