import React, { useState, useEffect } from "react";
import {
  BarChart,
  Users,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { Revenue } from "../types/database";
import { motion } from "framer-motion";

const DashboardWidget: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: number;
  delay?: number;
}> = ({ icon, title, value, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 
      transform hover:scale-105 transition-all duration-300 
      border border-white/10 relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="bg-blue-600/20 rounded-full p-3">
          {React.cloneElement(icon as React.ReactElement, {
            className: "text-blue-400 w-8 h-8",
          })}
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? <TrendingUp /> : <TrendingDown />}
            <span className="ml-2 text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-lg text-white/70 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className="absolute -bottom-4 -right-4 opacity-10">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-24 h-24",
        })}
      </div>
    </motion.div>
  );
};

const RevenueChart: React.FC<{ data: Revenue[] }> = ({ data }) => {
  const maxAmount = Math.max(...data.map((item) => item.amount), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full"
    >
      <h3 className="text-xl text-white mb-4">Revenus Mensuels</h3>
      <div className="flex justify-between items-end h-48">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(item.amount / maxAmount) * 100}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.2 + 0.5,
              type: "spring",
              stiffness: 50,
            }}
            className="flex flex-col items-center w-full group"
          >
            <div
              className="bg-blue-500 w-10 hover:bg-blue-600 transition-colors rounded-t-lg"
              title={`${item.monthName}: ${item.amount}€`}
            />
            <span className="text-white/70 mt-2 text-sm group-hover:text-white">
              {item.monthName}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    clientCount: 0,
    taskCount: 0,
    revenueTrend: 0,
  });
  const [revenues, setRevenues] = useState<Revenue[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Appels aux nouveaux endpoints API
        const [revenueRes, clientRes, taskRes] = await Promise.all([
          fetch("/api/dashboard/revenues").then((res) => {
            if (!res.ok) throw new Error("Erreur sur /revenues");
            return res.json();
          }),
          fetch("/api/dashboard/clients/stats").then((res) => {
            if (!res.ok) throw new Error("Erreur sur /clients/stats");
            return res.json();
          }),
          fetch("/api/dashboard/tasks/stats").then((res) => {
            if (!res.ok) throw new Error("Erreur sur /tasks/stats");
            return res.json();
          }),
        ]);

        // Traitement des données de revenus
        const totalRevenue = revenueRes.reduce(
          (sum: number, rev: Revenue) => sum + rev.amount,
          0
        );
        const revenueTrend =
          revenueRes.length > 1
            ? ((revenueRes[revenueRes.length - 1].amount -
                revenueRes[0].amount) /
                revenueRes[0].amount) *
              100
            : 0;

        // Mise à jour de l'état avec les données reçues
        setStats({
          totalRevenue,
          clientCount: clientRes.count,
          taskCount: taskRes.incompleteTasks,
          revenueTrend,
        });
        setRevenues(revenueRes);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du tableau de bord",
          error
        );
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-8 space-x-6"
      >
        <img
          src="/logo.png"
          alt="Logo FreelanceBox"
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 bg-white"
        />
        <div>
          <h1 className="text-4xl font-bold text-white">Tableau de Bord</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardWidget
          icon={<DollarSign />}
          title="Chiffre d'Affaires Total"
          value={`${stats.totalRevenue.toLocaleString()}€`}
          trend={stats.revenueTrend}
          delay={0.1}
        />
        <DashboardWidget
          icon={<Users />}
          title="Nombre de Clients"
          value={stats.clientCount}
          delay={0.2}
        />
        <DashboardWidget
          icon={<CheckSquare />}
          title="Tâches en Cours"
          value={stats.taskCount}
          delay={0.3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <RevenueChart data={revenues} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
        >
          <h3 className="text-xl text-white mb-4">Dernières Activités</h3>
          <div className="space-y-3">{/* Activités récentes */}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
