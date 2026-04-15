import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onClose();
    navigate("/register?role=student");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Attachment</h2>
            <p className="text-gray-600">Sign in as a student or admin to continue.</p>
          </div>

          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "login" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "register" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === "login" ? (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Welcome Back!</h3>
                  <p className="text-blue-700 mb-4">
                    Sign in to access student job matching or admin oversight tools.
                  </p>
                  <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign In to Your Account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2">Get Started!</h3>
                  <p className="text-green-700 mb-4">
                    Create a student account and start exploring internship opportunities.
                  </p>
                  <Button onClick={handleRegister} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Create Your Account
                  </Button>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-3">What you get:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Personalized student job recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  External application links for each opening
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Admin oversight for users and platform activity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
