import React from "react";
import {
  Home,
  Users,
  FileText,
  Briefcase,
  BarChart,
  CheckSquare,
  Folder,
  Building,
  CreditCard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  path: string;
}> = ({ icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center p-3 rounded-lg transition-all duration-300 
      ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: "mr-3",
      })}
      {label}
    </Link>
  );
};

const Navigation: React.FC = () => {
  const navItems = [
    { icon: <Home />, label: "Tableau de Bord", path: "/" },
    { icon: <Users />, label: "Clients", path: "/clients" },
    { icon: <FileText />, label: "Factures", path: "/invoices" },
    { icon: <Briefcase />, label: "Devis", path: "/quotes" },
    { icon: <CreditCard />, label: "Paiements", path: "/payments" },
    { icon: <BarChart />, label: "Statistiques", path: "/stats" },
    { icon: <CheckSquare />, label: "Tâches", path: "/tasks" },
    { icon: <Folder />, label: "Documents Pro", path: "/documents" },
    { icon: <Building />, label: "Mon Entreprise", path: "/company" }, // Ajout de la navigation pour Mon Entreprise
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          icon={item.icon}
          label={item.label}
          path={item.path}
        />
      ))}
    </nav>
  );
};

export default Navigation;
