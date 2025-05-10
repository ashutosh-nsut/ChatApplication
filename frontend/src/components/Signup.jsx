import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";


const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male", // Default gender to male
  });

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    

    try {
      const res = await axios.post(`https://chatapplication-ih32.onrender.com/api/v1/user/register`, user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      console.log("API Response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error.response);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center">Signup</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className="label p-2"><span className="text-base label-text">Full Name</span></label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <label className="label p-2"><span className="text-base label-text">Username</span></label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label className="label p-2"><span className="text-base label-text">Password</span></label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label className="label p-2"><span className="text-base label-text">Confirm Password</span></label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="flex items-center my-4">
            <p>Gender:</p>
            <label className="mx-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={user.gender === "male"}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
              /> Male
            </label>
            <label className="mx-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={user.gender === "female"}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
              /> Female
            </label>
          </div>
          <p className="text-center my-2">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <div>
            <button type="submit" className="btn btn-block btn-sm mt-2 border border-slate-700">
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
