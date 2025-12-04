
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Approvals = () => {
  const [pendingRequests, setPendingRequests] = useState(() => {
    const saved = localStorage.getItem('pendingApprovals');
    return saved ? JSON.parse(saved) : [
      { id: 1, user: 'Mike Davis', role: 'student', task: 'Advanced code generation for final project', category: 'Technical', priority: 'high', timestamp: new Date().toISOString(), details: 'Requesting AI assistance to generate boilerplate code for React application.' },
      { id: 2, user: 'Jennifer Smith', role: 'teacher', task: 'Bulk quiz question generation', category: 'Academic', priority: 'medium', timestamp: new Date(Date.now() - 600000).toISOString(), details: 'Need AI to create 50 multiple choice questions for biology exam.' },
      { id: 3, user: 'Tom Wilson', role: 'student', task: 'AI-powered presentation slides', category: 'Creative', priority: 'low', timestamp: new Date(Date.now() - 1200000).toISOString(), details: 'Using AI to design presentation slides for history project.' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('pendingApprovals', JSON.stringify(pendingRequests));
  }, [pendingRequests]);

  const handleApprove = (id) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
    toast({
      title: "Request Approved",
      description: "The AI usage request has been approved successfully.",
    });
  };

  const handleReject = (id) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
    toast({
      title: "Request Rejected",
      description: "The AI usage request has been rejected.",
      variant: "destructive"
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
        <p className="text-gray-600 mt-1">Review and approve AI usage requests from teachers and students</p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending approval requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.user}</h3>
                      <p className="text-sm text-gray-500 capitalize">{request.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)} capitalize`}>
                    {request.priority} Priority
                  </span>
                  <span className="text-xs text-gray-500">{formatTimestamp(request.timestamp)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{request.task}</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{request.details}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {request.category}
                </span>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(request.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;
