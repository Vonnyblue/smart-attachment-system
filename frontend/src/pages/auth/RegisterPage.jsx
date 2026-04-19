import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { getDashboardPath } from "../../utils/roleRouting";
import SkillsInput from "../../components/common/SkillsInput";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    notification_frequency: "daily",
    role: "student",
    // student fields
    field: "",
    skills: "",
    preferred_location: "",
    bio: "",
    // hr fields
    company_name: "",
    company_description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const { register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const role = searchParams.get("role");
    if (role && ["student", "hr"].includes(role)) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [searchParams]);

  const isHR = formData.role === "hr";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (isHR && !formData.company_name) newErrors.company_name = "Company name is required for HR accounts";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);
    if (result.success) {
      navigate(getDashboardPath(result.user?.role));
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Attachment
            </span>
          </Link>
          <h2 className="mt-8 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-3 text-lg text-gray-600">
            {isHR ? "Post internships and find matching students" : "Find internships that match your skills"}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="space-y-5">
              <Input
                label="Full name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="Enter your full name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="hr">HR / Employer</option>
                </select>
              </div>

              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="Create a password"
              />
              <Input
                label="Confirm password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                placeholder="Confirm your password"
              />

              {/* HR-specific fields */}
              {isHR && (
                <>
                  <Input
                    label="Company name"
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    error={errors.company_name}
                    required
                    placeholder="Your organisation name"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company description</label>
                    <textarea
                      name="company_description"
                      value={formData.company_description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Brief description of your organisation"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Student-specific fields */}
              {!isHR && (
                <>
                  <Input
                    label="Field of study"
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    placeholder="Computer Science, Finance, Marketing..."
                  />
                  <SkillsInput
                    label="Skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, SQL, AutoCAD, Public speaking..."
                  />
                  <Input
                    label="Preferred location"
                    type="text"
                    name="preferred_location"
                    value={formData.preferred_location}
                    onChange={handleChange}
                    placeholder="Nairobi, Remote, Hybrid..."
                  />
                  <Input
                    label="Short bio"
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="A sentence about your strengths and goals"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification frequency</label>
                    <select
                      name="notification_frequency"
                      value={formData.notification_frequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600">
            <span className="mr-2">←</span>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;