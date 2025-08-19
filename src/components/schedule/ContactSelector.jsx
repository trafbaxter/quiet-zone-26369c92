import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactSelector({ contacts, selectedContact, onSelectContact }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Users className="w-6 h-6 text-blue-600" />
          Select Contact
        </CardTitle>
        <p className="text-gray-600">Choose who you want to set Do Not Disturb for</p>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectContact(contact)}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${selectedContact?.id === contact.id 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${selectedContact?.id === contact.id 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                      : 'bg-gray-100'
                    }
                  `}>
                    <User className={`w-6 h-6 ${selectedContact?.id === contact.id ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <Badge className={`${relationshipColors[contact.relationship || 'other']} border text-xs mt-1`}>
                      {(contact.relationship || 'other').charAt(0).toUpperCase() + (contact.relationship || 'other').slice(1)}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No contacts found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}