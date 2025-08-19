import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DNDSession } from "@/api/entities";
import { Zap, Clock, User } from "lucide-react";
import { addHours, addMinutes } from "date-fns";

export default function QuickActions({ contacts, onSessionCreated }) {
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1h");
  const [isCreating, setIsCreating] = useState(false);

  const durations = {
    "15m": { label: "15 minutes", minutes: 15 },
    "30m": { label: "30 minutes", minutes: 30 },
    "1h": { label: "1 hour", hours: 1 },
    "2h": { label: "2 hours", hours: 2 },
    "4h": { label: "4 hours", hours: 4 },
    "8h": { label: "8 hours", hours: 8 }
  };

  const handleQuickSchedule = async () => {
    if (!selectedContact || !selectedDuration) return;

    setIsCreating(true);
    try {
      const contact = contacts.find(c => c.id === selectedContact);
      const now = new Date();
      const duration = durations[selectedDuration];
      
      let endTime;
      if (duration.minutes) {
        endTime = addMinutes(now, duration.minutes);
      } else {
        endTime = addHours(now, duration.hours);
      }

      await DNDSession.create({
        contact_id: contact.id,
        contact_name: contact.name,
        start_time: now.toISOString(),
        end_time: endTime.toISOString(),
        reason: "Quick DND session",
        is_active: true,
        notification_sent: false
      });

      setSelectedContact("");
      setSelectedDuration("1h");
      onSessionCreated();
    } catch (error) {
      console.error('Error creating quick session:', error);
    }
    setIsCreating(false);
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Contact</label>
            <Select value={selectedContact} onValueChange={setSelectedContact}>
              <SelectTrigger className="bg-white border-orange-200">
                <SelectValue placeholder="Select contact">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedContact && contacts.find(c => c.id === selectedContact)?.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {contact.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="bg-white border-orange-200">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {durations[selectedDuration]?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(durations).map(([key, duration]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {duration.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleQuickSchedule}
            disabled={!selectedContact || !selectedDuration || isCreating}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isCreating ? 'Starting...' : 'Start Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}