import React, { useState, useEffect } from "react";
import { Contact } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail,
  Users,
  Heart,
  Briefcase,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ContactCard from "../components/contacts/ContactCard";
import AddContactDialog from "../components/contacts/AddContactDialog";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRelationship, setSelectedRelationship] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    const data = await Contact.list('name');
    setContacts(data);
    setIsLoading(false);
  };

  const handleAddContact = async (contactData) => {
    await Contact.create(contactData);
    setShowAddDialog(false);
    loadContacts();
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRelationship = selectedRelationship === "all" || 
                               contact.relationship === selectedRelationship;
    
    return matchesSearch && matchesRelationship;
  });

  const relationshipIcons = {
    family: Heart,
    friend: User,
    colleague: Briefcase,
    acquaintance: UserCheck,
    other: User
  };

  const relationshipColors = {
    family: "bg-red-50 text-red-700 border-red-200",
    friend: "bg-blue-50 text-blue-700 border-blue-200", 
    colleague: "bg-purple-50 text-purple-700 border-purple-200",
    acquaintance: "bg-green-50 text-green-700 border-green-200",
    other: "bg-gray-50 text-gray-700 border-gray-200"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Contacts
            </h1>
            <p className="text-gray-600">Manage your contact list</p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
              <div className="text-sm text-gray-500">Total Contacts</div>
            </CardContent>
          </Card>
          
          {['family', 'friend', 'colleague'].map(type => (
            <Card key={type} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                {React.createElement(relationshipIcons[type], {
                  className: "w-8 h-8 text-blue-600 mx-auto mb-2"
                })}
                <div className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.relationship === type).length}
                </div>
                <div className="text-sm text-gray-500 capitalize">{type}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'family', 'friend', 'colleague', 'acquaintance', 'other'].map(type => (
                  <Button
                    key={type}
                    variant={selectedRelationship === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRelationship(type)}
                    className={`capitalize ${selectedRelationship === type ? 
                      'bg-gradient-to-r from-blue-600 to-purple-600' : 
                      'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredContacts.length === 0 ? (
              <div className="col-span-full">
                <Card className="border-dashed border-2 border-gray-200 bg-white/50">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      {searchTerm || selectedRelationship !== 'all' ? 'No contacts found' : 'No contacts yet'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchTerm || selectedRelationship !== 'all' ? 
                        'Try adjusting your search or filter criteria' : 
                        'Add your first contact to get started'
                      }
                    </p>
                    <Button 
                      onClick={() => setShowAddDialog(true)}
                      variant="outline" 
                      className="border-gray-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Contact
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredContacts.map((contact, index) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  index={index}
                  relationshipColors={relationshipColors}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        <AddContactDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddContact}
        />
      </div>
    </div>
  );
}