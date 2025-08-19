import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, Clock, Calendar, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function SessionPreview({ contact, times, reason, onSchedule, isSubmitting }) {
  const relationshipColors = {
    family: "bg-red-50 text-red-700 border-red-200",
    friend: "bg-blue-50 text-blue-700 border-blue-200", 
    colleague: "bg-purple-50 text-purple-700 border-purple-200",
    acquaintance: "bg-green-50 text-green-700 border-green-200",
    other: "bg-gray-50 text-gray-700 border-gray-200"
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Review & Schedule
        </CardTitle>
        <p className="text-gray-600">Review your DND session details before scheduling</p>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100"
        >
          {/* Contact Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
              <Badge className={`${relationshipColors[contact.relationship || 'other']} border`}>
                {(contact.relationship || 'other').charAt(0).toUpperCase() + (contact.relationship || 'other').slice(1)}
              </Badge>
            </div>
          </div>

          {/* Time Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Start:</span>
              <span>{format(times.start, 'EEEE, MMM d, yyyy - h:mm a')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-medium">End:</span>
              <span>{format(times.end, 'EEEE, MMM d, yyyy - h:mm a')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">Duration:</span>
              <span>{Math.round((times.end - times.start) / (1000 * 60))} minutes</span>
            </div>
          </div>

          {/* Reason */}
          {reason && (
            <div className="flex items-start gap-3 text-gray-700 mb-6">
              <MessageCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Reason:</span>
                <p className="text-gray-600 italic mt-1">"{reason}"</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={onSchedule}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg text-lg py-6"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Scheduling DND...' : 'Schedule Do Not Disturb'}
          </Button>
        </motion.div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> During this period, calls and messages from {contact.name} will be automatically silenced. 
            You'll receive a summary after the DND period ends.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}