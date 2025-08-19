
import React, { useState, useEffect } from "react";
import { DNDSession, Contact, User } from "@/api/entities"; // Added User import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, 
  Plus, 
  Clock, 
  User as UserIcon, // Aliased User to UserIcon to avoid conflict with User entity
  X, 
  Pause, 
  Play,
  ShieldCheck,
  ShieldOff
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import ActiveSessionCard from "../components/dashboard/ActiveSessionCard";
import StatsOverview from "../components/dashboard/StatsOverview";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true); // Start loading when checking auth
      try {
        await User.me(); // Check if user is logged in
        setIsLoggedIn(true);
        // If logged in, proceed to load data
        await loadData(); 
      } catch (error) {
        // User is not logged in or session expired
        console.warn('Authentication check failed:', error);
        setIsLoggedIn(false);
        setSessions([]); // Clear any stale data
        setContacts([]); // Clear any stale data
        setIsLoading(false); // Stop loading, as data won't be fetched
      }
    };

    initializeDashboard();

    // Set up interval for data refresh ONLY if isLoggedIn becomes true
    let intervalId;
    if (isLoggedIn) {
      intervalId = setInterval(loadData, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear interval on component unmount or isLoggedIn change
      }
    };
  }, [isLoggedIn]); // Re-run this effect when isLoggedIn changes

  const loadData = async () => {
    try {
      const [sessionsData, contactsData] = await Promise.all([
        DNDSession.list('-created_date'),
        Contact.list('name')
      ]);
      setSessions(sessionsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false); // Ensure isLoading is set to false after data fetch attempt
    }
  };

  const endSession = async (sessionId) => {
    await DNDSession.update(sessionId, { is_active: false });
    loadData();
  };

  const pauseSession = async (sessionId) => {
    // In a real app, this would pause the session
    console.log('Pausing session:', sessionId);
  };

  const activeSessions = sessions.filter(session => {
    const now = new Date();
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);
    return session.is_active && isAfter(now, startTime) && isBefore(now, endTime);
  });

  const upcomingSessions = sessions.filter(session => {
    const now = new Date();
    const startTime = new Date(session.start_time);
    return session.is_active && isAfter(startTime, now);
  }).slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-xl shadow-2xl border-0">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Quiet Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-8">
                Your personal space to manage distractions and focus on what matters.
              </p>
              <Button
                onClick={() => User.loginWithRedirect(window.location.href)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-lg py-6"
              >
                Log In to Continue
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Manage your Do Not Disturb sessions</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Schedule")} className="flex-1 md:flex-none">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Schedule DND
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          activeSessions={activeSessions}
          totalSessions={sessions}
          totalContacts={contacts}
          isLoading={isLoading}
        />

        {/* Quick Actions */}
        <QuickActions contacts={contacts} onSessionCreated={loadData} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Active Sessions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                Active Sessions
              </h2>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                {activeSessions.length} active
              </Badge>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : activeSessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="border-dashed border-2 border-gray-200">
                      <CardContent className="p-12 text-center">
                        <ShieldOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">No active sessions</h3>
                        <p className="text-gray-400 mb-6">Your contacts can reach you freely right now</p>
                        <Link to={createPageUrl("Schedule")}>
                          <Button variant="outline" className="border-gray-300">
                            <Plus className="w-4 h-4 mr-2" />
                            Schedule DND
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  activeSessions.map((session) => (
                    <ActiveSessionCard
                      key={session.id}
                      session={session}
                      onEnd={() => endSession(session.id)}
                      onPause={() => pauseSession(session.id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Upcoming
              </h2>
            </div>

            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <Card className="border border-gray-100">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No upcoming sessions</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-blue-600" /> {/* Using aliased UserIcon */}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{session.contact_name}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(session.start_time), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
