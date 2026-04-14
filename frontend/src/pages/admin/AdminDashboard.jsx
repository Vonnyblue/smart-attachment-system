import React, { useEffect, useMemo, useState } from "react";
import {
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserCircle2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Card, { CardBody } from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth";
import { adminAPI } from "../../services/api";

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [overviewResponse, usersResponse] = await Promise.all([
        adminAPI.getOverview(),
        adminAPI.getUsers(),
      ]);

      setOverview(overviewResponse);
      setUsers(usersResponse.users || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load admin operations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const metrics = overview?.metrics || {};
  const completionAverage = useMemo(() => {
    if (!users.length) return 0;
    const score = users.reduce((sum, currentUser) => {
      const filled = [
        Boolean(currentUser.name),
        Boolean(currentUser.email),
        Boolean(currentUser.field),
        Boolean(currentUser.skills),
        Boolean(currentUser.preferred_location),
      ].filter(Boolean).length;
      return sum + Math.round((filled / 5) * 100);
    }, 0);
    return Math.round(score / users.length);
  }, [users]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-zinc-400 text-sm uppercase tracking-[0.2em]">Admin operations</p>
              <h1 className="text-4xl font-bold mt-2">Platform control center</h1>
              <p className="text-zinc-300 mt-2 max-w-2xl">
                Monitor signups, student profile quality, and overall platform readiness for your presentation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-zinc-950 hover:bg-zinc-100" onClick={loadAdminData}>
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="border-zinc-500 text-white hover:bg-zinc-900" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total users", value: metrics.total_users || 0, icon: Users },
            { label: "Students", value: metrics.students || 0, icon: UserCircle2 },
            { label: "Admins", value: metrics.admins || 0, icon: ShieldCheck },
            { label: "Avg. profile completion", value: `${completionAverage}%`, icon: RefreshCw },
          ].map((item) => (
            <Card key={item.label}>
              <CardBody className="p-5">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                    <item.icon className="text-zinc-700" size={22} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-zinc-500">{item.label}</p>
                    <p className="text-2xl font-bold text-zinc-900">{item.value}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {loading ? (
          <div className="text-zinc-600">Loading platform metrics...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardBody className="p-6">
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Recent users</h2>
                <div className="space-y-4">
                  {users.slice(0, 10).map((account) => (
                    <div key={account.id} className="rounded-xl border border-zinc-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-zinc-900">{account.name}</h3>
                          <p className="text-sm text-zinc-600">{account.email}</p>
                        </div>
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 capitalize">
                          {account.role}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-zinc-600">
                        {account.field || "No field set"} · {account.preferred_location || "No location set"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Oversight notes</h2>
                <div className="space-y-4 text-zinc-600">
                  <p>The platform is now focused on two personas only: students and admins.</p>
                  <p>Students maintain a profile, search internships, and open the source listing to apply externally.</p>
                  <p>Admins oversee account growth, role distribution, and how complete student profiles are for better matching.</p>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
