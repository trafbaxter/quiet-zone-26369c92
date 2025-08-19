import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar } from "lucide-react";
import { addHours, addMinutes, format } from "date-fns";

export default function TimeSelector({ selectedTimes, onTimesChange, reason, onReasonChange }) {
  const presetDurations = [
    { label: "15 min", minutes: 15 },
    { label: "30 min", minutes: 30 },
    { label: "1 hour", hours: 1 },
    { label: "2 hours", hours: 2 },
    { label: "4 hours", hours: 4 },
    { label: "8 hours", hours: 8 }
  ];

  const handlePresetDuration = (preset) => {
    const now = new Date();
    let endTime;
    
    if (preset.minutes) {
      endTime = addMinutes(now, preset.minutes);
    } else {
      endTime = addHours(now, preset.hours);
    }

    onTimesChange({
      start: now,
      end: endTime
    });
  };

  const handleStartTimeChange = (dateString) => {
    const startTime = new Date(dateString);
    onTimesChange({
      ...selectedTimes,
      start: startTime
    });
  };

  const handleEndTimeChange = (dateString) => {
    const endTime = new Date(dateString);
    onTimesChange({
      ...selectedTimes,
      end: endTime
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Clock className="w-6 h-6 text-purple-600" />
          Set Time & Duration
        </CardTitle>
        <p className="text-gray-600">When should the Do Not Disturb period be active?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Quick Duration</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {presetDurations.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePresetDuration(preset)}
                className="border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Time Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="start-time" className="text-base font-semibold">Start Time</Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={selectedTimes.start ? format(selectedTimes.start, "yyyy-MM-dd'T'HH:mm") : ""}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="mt-2 border-gray-200 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <Label htmlFor="end-time" className="text-base font-semibold">End Time</Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={selectedTimes.end ? format(selectedTimes.end, "yyyy-MM-dd'T'HH:mm") : ""}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="mt-2 border-gray-200 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <Label htmlFor="reason" className="text-base font-semibold">Reason (Optional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Why are you setting this DND? (e.g., Important meeting, Focus time, etc.)"
            className="mt-2 border-gray-200 focus:ring-2 focus:ring-purple-500/20 h-24"
          />
        </div>

        {/* Time Preview */}
        {selectedTimes.start && selectedTimes.end && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">DND Period</span>
            </div>
            <p className="text-purple-700">
              From <strong>{format(selectedTimes.start, 'MMM d, h:mm a')}</strong> to <strong>{format(selectedTimes.end, 'MMM d, h:mm a')}</strong>
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Duration: {Math.round((selectedTimes.end - selectedTimes.start) / (1000 * 60))} minutes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}