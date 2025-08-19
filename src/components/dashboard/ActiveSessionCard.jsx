import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock, X, Pause, MessageCircle } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { motion } from "framer-motion";

export default function ActiveSessionCard({ session, onEnd, onPause }) {
  const timeRemaining = differenceInMinutes(new Date(session.end_time), new Date());
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {session.contact_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(session.start_time), 'h:mm a')} - {format(new Date(session.end_time), 'h:mm a')}
                  </span>
                </div>
                {session.reason && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MessageCircle className="w-4 h-4" />
                    <span className="italic">"{session.reason}"</span>
                  </div>
                )}
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  {timeRemaining > 0 ? `${timeRemaining}m remaining` : 'Ending soon'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onPause}
                className="border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
              >
                <Pause className="w-4 h-4 text-yellow-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onEnd}
                className="border-gray-200 hover:border-red-300 hover:bg-red-50"
              >
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}