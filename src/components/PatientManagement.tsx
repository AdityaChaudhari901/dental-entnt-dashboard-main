
import React, { useState } from 'react';
import { useApp, Patient } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, User, Phone, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const PatientManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    address: '',
    healthInfo: '',
    emergencyContact: '',
  });

  const filteredPatients = state.patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      contact: '',
      email: '',
      address: '',
      healthInfo: '',
      emergencyContact: '',
    });
    setEditingPatient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      const updatedPatient: Patient = {
        ...editingPatient,
        ...formData,
      };
      dispatch({ type: 'UPDATE_PATIENT', payload: updatedPatient });
      toast.success('Patient updated successfully');
    } else {
      const newPatient: Patient = {
        id: `p${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PATIENT', payload: newPatient });
      toast.success('Patient added successfully');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      email: patient.email,
      address: patient.address,
      healthInfo: patient.healthInfo,
      emergencyContact: patient.emergencyContact,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}? This will also delete all associated appointments.`)) {
      dispatch({ type: 'DELETE_PATIENT', payload: patient.id });
      toast.success('Patient deleted successfully');
    }
  };

  const getPatientStats = (patientId: string) => {
    const incidents = state.incidents.filter(i => i.patientId === patientId);
    const completed = incidents.filter(i => i.status === 'Completed').length;
    const pending = incidents.filter(i => i.status !== 'Completed').length;
    const totalSpent = incidents
      .filter(i => i.status === 'Completed' && i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);
    
    return { total: incidents.length, completed, pending, totalSpent };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage your patient database</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-medical-600 hover:bg-medical-700" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </DialogTitle>
              <DialogDescription>
                {editingPatient ? 'Update patient information' : 'Enter patient details to add them to the system'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact">Phone Number *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="healthInfo">Health Information</Label>
                <Textarea
                  id="healthInfo"
                  value={formData.healthInfo}
                  onChange={(e) => setFormData({...formData, healthInfo: e.target.value})}
                  rows={3}
                  placeholder="Allergies, medical conditions, medications, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  placeholder="Name - Phone number"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-medical-600 hover:bg-medical-700">
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const stats = getPatientStats(patient.id);
          return (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-medical-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>
                        Age: {new Date().getFullYear() - parseISO(patient.dob).getFullYear()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(patient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(patient)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{patient.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(parseISO(patient.createdAt), 'MMM yyyy')}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-medical-600">{stats.total}</div>
                      <div className="text-gray-500">Appointments</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-success-600">${stats.totalSpent}</div>
                      <div className="text-gray-500">Total Spent</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-2 mt-2">
                    <Badge variant="secondary">{stats.completed} completed</Badge>
                    {stats.pending > 0 && (
                      <Badge variant="outline">{stats.pending} pending</Badge>
                    )}
                  </div>
                </div>
                
                {patient.healthInfo && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      <strong>Health Info:</strong> {patient.healthInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-medical-600 hover:bg-medical-700">
                <Plus className="mr-2 h-4 w-4" />
                Add First Patient
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientManagement;
