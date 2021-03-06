const Users = () => import("../views-admin/users/Users");

const Dashboard = () => import("../views-admin/dashboard/Dashboard.vue");

const CreateAccount = () => import("../views-admin/auth/CreateAccount.vue");
const InviteAdmin = () => import("../views-admin/auth/InviteAdmin.vue");
const Login = () => import("../views/Auth/Login.vue");

const Symptoms = () => import("../views-admin/symptoms/Symptoms.vue");
const TestReports = () => import("../views-admin/test-reports/TestReports.vue");
const RegisterTestReport = () =>
  import("../views-admin/test-reports/RegisterTestReport");

const CaseInvestigations = () =>
  import("../views-admin/case-investigation/CaseInvestigations");
const RegisterCaseInvestigation = () =>
  import("../views-admin/case-investigation/RegisterCaseInvestigation");
const EditCaseInvestigation = () =>
  import("../views-admin/case-investigation/EditCaseInvestigation");

export const admin = [
  {
    name: "AdminLogin",
    path: "login",
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    name: "CreateAccount",
    path: "register",
    component: CreateAccount,
    meta: {
      guest: true
    }
  },
  {
    name: "Symptoms",
    path: "symptoms",
    component: Symptoms,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    path: "test-reports",
    component: {
      template: "<router-view />"
    },
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    },
    children: [
      {
        name: "RegisterTestReport",
        path: "register",
        component: RegisterTestReport,
        meta: { requiresAuth: true, roles: ["ephi_user", "healthcare_worker"] }
      },
      {
        name: "TestReports",
        path: "/",
        component: TestReports,
        meta: { requiresAuth: true, roles: ["ephi_user"] }
      }
    ]
  },
  {
    path: "case-investigations",
    component: {
      template: "<router-view />"
    },
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    },
    children: [
      {
        name: "RegisterCaseInvestigation",
        path: "register",
        component: RegisterCaseInvestigation,
        meta: { requiresAuth: true, roles: ["ephi_user", "healthcare_worker"] }
      },
      {
        name: "EditCaseInvestigation",
        path: "edit/:id",
        component: EditCaseInvestigation,
        meta: { requiresAuth: true, roles: ["ephi_user", "healthcare_worker"] }
      },
      {
        name: "CaseInvestigations",
        path: "/",
        component: CaseInvestigations,
        meta: { requiresAuth: true, roles: ["ephi_user"] }
      }
    ]
  },
  {
    name: "InviteAdmin",
    path: "invite-admin",
    component: InviteAdmin,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "Users",
    path: "users",
    component: Users,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "Dashboard",
    path: "/",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  }
];
