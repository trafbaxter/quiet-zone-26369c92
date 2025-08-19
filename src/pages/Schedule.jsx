import React, { useState, useEffect } from "react";
import { DNDSession, Contact } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import ContactSelector from "../components/schedule/ContactSelector";
import TimeSelector from "../components/schedule/TimeSelector";
import SessionPreview from "../components/schedule/SessionPreview";

export default function SchedulePage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState({
    start: null,
    end: null
  });
  const [reason, setReason] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const data = await Contact.list('name');
    setContacts(data);
  };

  const handleSchedule = async () => {
    if (!selectedContact || !selectedTimes.start || !selectedTimes.end) return;
    
    setIsSubmitting(true);
    try {
      await DNDSession.create({
        contact_id: selectedContact.id,
        contact_name: selectedContact.name,
        start_time: selectedTimes.start.toISOString(),
        end_time: selectedTimes.end.toISOString(),
        reason: reason || undefined,
        is_active: true,
        notification_sent: false
      });
      
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error('Error scheduling DND:', error);
    }
    setIsSubmitting(false);
  };

  const canProceedToStep2 = selectedContact !== null;
  const canProceedToStep3 = canProceedToStep2 && selectedTimes.start && selectedTimes.end;
  const canSchedule = canProceedToStep3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Schedule DND
            </h1>
            <p className="text-gray-600">Set up a Do Not Disturb session</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {step === 1 ? <User className="w-5 h-5" /> : 
                   step === 2 ? <Clock className="w-5 h-5" /> : 
                   <Calendar className="w-5 h-5" />}
                </div>
                {step < 3 && (
                  <div className={`
                    w-16 h-1 mx-4 transition-all duration-300
                    ${currentStep > step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ContactSelector
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TimeSelector
                selectedTimes={selectedTimes}
                onTimesChange={setSelectedTimes}
                reason={reason}
                onReasonChange={setReason}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SessionPreview
                contact={selectedContact}
                times={selectedTimes}
                reason={reason}
                onSchedule={handleSchedule}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="border-gray-200 hover:border-gray-300"
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3)
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSchedule}
                disabled={!canSchedule || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule DND'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}