export const getDashboardPath = (role) => {
  switch ((role || "student").toLowerCase()) {
    case "admin":
      return "/admin/dashboard";
    case "student":
    default:
      return "/student/dashboard";
  }
};
