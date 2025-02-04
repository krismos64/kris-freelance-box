import React, { useState, useEffect } from "react";
import {
  BarChart2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
} from "lucide-react";
import { DashboardService } from "../services/api";
import {
  Revenue,
  ClientStats,
  TaskStats,
  InvoiceStats,
} from "../types/database";
import { motion } from "framer-motion";

// Composant pour les cartes de statistiques
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: number;
}> = ({ icon, title, value, trend }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform transition-all hover:scale-105">
    <div className="flex justify-between items-center mb-4">
      <div className="text-4xl text-white/80">{icon}</div>
      {trend !== undefined && (
        <div
          className={`flex items-center ${
            trend >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend >= 0 ? <TrendingUp /> : <TrendingDown />}
          <span className="ml-2">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="text-lg text-white/70 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const SimpleBarChart: React.FC<{ data: Revenue[] }> = ({ data }) => {
  const maxAmount = Math.max(...data.map((item) => item.amount));

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-xl text-white mb-4">Revenus Mensuels</h3>
      <div className="flex justify-between items-end h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className="bg-blue-500 w-10 hover:bg-blue-600 transition-colors"
              style={{
                height: `${(item.amount / maxAmount) * 100}%`,
                minHeight: "10px",
              }}
              title={`${item.monthName}: ${item.amount}€`}
            />
            <span className="text-white/70 mt-2 text-sm">{item.monthName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    clientCount: 0,
    invoiceCount: 0,
    quoteCount: 0,
    averageInvoiceValue: 0,
    monthlyRevenueTrend: 0,
  });
  const [revenues, setRevenues] = useState<Revenue[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [revenueData, clientStats, taskStats, invoiceStats] =
          await Promise.all([
            DashboardService.fetchRevenues(),
            DashboardService.fetchClientStats(),
            DashboardService.fetchTaskStats(),
            DashboardService.fetchInvoiceStats(),
          ]);

        const totalRevenue = revenueData.reduce(
          (sum, rev) => sum + rev.amount,
          0
        );
        const monthlyRevenueTrend =
          revenueData.length > 1
            ? ((revenueData[revenueData.length - 1].amount -
                revenueData[0].amount) /
                revenueData[0].amount) *
              100
            : 0;

        setStats({
          totalRevenue,
          clientCount: clientStats.count,
          invoiceCount: invoiceStats.count,
          quoteCount: invoiceStats.quoteCount,
          averageInvoiceValue: invoiceStats.averageValue,
          monthlyRevenueTrend,
        });
        setRevenues(revenueData);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="p-6 bg-white/5 rounded-xl space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Tableau de Bord Statistiques
      </h1>

      {/* Statistiques Principales */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<DollarSign />}
          title="Chiffre d'Affaires Total"
          value={`${stats.totalRevenue.toFixed(2)}€`}
          trend={stats.monthlyRevenueTrend}
        />
        <StatCard
          icon={<Users />}
          title="Nombre de Clients"
          value={`${stats.clientCount}`}
        />
        <StatCard
          icon={<FileText />}
          title="Factures Émises"
          value={`${stats.invoiceCount}`}
        />
      </div>

      {/* Graphiques et Détails */}
      <div className="grid md:grid-cols-2 gap-6">
        <SimpleBarChart data={revenues} />

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl text-white mb-4">Détails Financiers</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-white/80">
              <span>Nombre de Devis</span>
              <span>{stats.quoteCount}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Valeur Moyenne des Factures</span>
              <span>{stats.averageInvoiceValue.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Tendance des Revenus</span>
              <span
                className={
                  stats.monthlyRevenueTrend >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {stats.monthlyRevenueTrend.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
