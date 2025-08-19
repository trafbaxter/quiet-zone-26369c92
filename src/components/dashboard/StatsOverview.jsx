import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsOverview({ activeSessions, totalSessions, totalContacts, isLoading }) {
  const stats = [
    {
      title: "Active Sessions",
      value: activeSessions.length,
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "Total Contacts", 
      value: totalContacts.length,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      title: "Total Sessions",
      value: totalSessions.length,
      icon: Clock,
      color: "from-green-500 to-green-600", 
      bgColor: "from-green-50 to-green-100"
    },
    {
      title: "This Week",
      value: totalSessions.filter(s => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(s.created_date) > weekAgo;
      }).length,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-r ${stat.bgColor} border-0 shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}