const NotFound = () => import("@/views/Errors/404.vue");

const Home = () => import("@/views/Home/Home.vue");
const Information = () => import("@/views/Information/Information.vue");
const About = () => import("@/views/About/About.vue");
const News = () => import("@/views/News/News.vue");
const HeatMap = () => import("@/views/HeatMap/HeatMap.vue");
const Profile = () => import("@/views/Profile/Profile.vue");
const References = () => import("@/views/References/References.vue");
const PrivacyPolicy = () => import("@/views/PrivacyPolicy/PrivacyPolicy.vue");
const Login = () => import("@/views/Auth/Login.vue");
const Register = () => import("@/views/Auth/Register.vue");
const ForgotPassword = () => import("../views-admin/auth/ForgotPassword");

const ChangePassword = () => import("../views-admin/auth/ChangePassword.vue");
const Ethiopia = () => import("../views/Home/Ethiopia/Ethiopia");

const Statistics = () => import("../views/Home/Statistics");
const Symptoms = () => import("../views/HeatMap/Symptoms");

export const userRoutes = [
  {
    path: "statistics",
    name: "Statistics",
    component: Statistics,
    meta: {
      guest: true
    }
  },
  {
    path: "symptoms",
    name: "DisplaySymptoms",
    component: Symptoms,
    meta: {
      guest: true
    }
  },
  {
    path: "ethiopia",
    name: "Ethiopia",
    component: Ethiopia,
    meta: {
      guest: true
    }
  },
  {
    path: "information",
    name: "Learn",
    component: Information,
    meta: {
      guest: true
    }
  },
  {
    path: "privacy-policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
    meta: {
      guest: true
    }
  },
  { path: "references", name: "References", component: References },
  {
    path: "profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user", "basic"]
    }
  },
  {
    name: "ResetPassword",
    path: "reset-password",
    component: ForgotPassword,
    meta: {
      guest: true
    }
  },
  {
    name: "ChangePassword",
    path: "change-password",
    component: ChangePassword,
    meta: {
      guest: true
    }
  },
  {
    path: "register",
    name: "Register",
    component: Register,
    meta: {
      guest: true
    }
  },
  {
    path: "login",
    name: "Login",
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: "about",
    name: "About",
    component: About,
    meta: {
      guest: true
    }
  },
  {
    path: "news",
    name: "News",
    component: News,
    meta: {
      guest: true
    }
  },
  {
    path: "map",
    name: "Map",
    component: HeatMap,
    meta: {
      guest: true
    }
  },
  {
    path: "",
    name: "Home",
    component: Home,
    meta: {
      guest: true
    }
  },
  {
    path: "*",
    name: "404",
    component: NotFound,
    meta: {
      notFound: true
    }
  }
];
