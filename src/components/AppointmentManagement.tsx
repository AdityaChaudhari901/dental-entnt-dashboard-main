
import React, { useState, useRef } from 'react';
import { useApp, Incident, FileAttachment } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar, 
  Clock,
  DollarSign,
  FileText,
  Upload,
  X,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const AppointmentManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress',
    nextDate: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);

  const filteredIncidents = state.incidents.filter(incident => {
    const patient = state.patients.find(p => p.id === incident.patientId);
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'scheduled' && incident.status === 'Scheduled') ||
      (activeTab === 'completed' && incident.status === 'Completed') ||
      (activeTab === 'pending' && ['In Progress', 'Scheduled'].includes(incident.status));
    
    return matchesSearch && matchesTab;
  });

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      cost: '',
      treatment: '',
      status: 'Scheduled',
      nextDate: '',
    });
    setUploadedFiles([]);
    setEditingIncident(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileAttachment: FileAttachment = {
          name: file.name,
          url: e.target?.result as string,
          type: file.type,
          size: file.size,
        };
        setUploadedFiles(prev => [...prev, fileAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIncident) {
      const updatedIncident: Incident = {
        ...editingIncident,
        patientId: formData.patientId,
        title: formData.title,
        description: formData.description,
        comments: formData.comments,
        appointmentDate: formData.appointmentDate,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        treatment: formData.treatment,
        status: formData.status,
        nextDate: formData.nextDate || undefined,
        files: [...(editingIncident.files || []), ...uploadedFiles],
      };
      dispatch({ type: 'UPDATE_INCIDENT', payload: updatedIncident });
      toast.success('Appointment updated successfully');
    } else {
      const newIncident: Incident = {
        id: `i${Date.now()}`,
        patientId: formData.patientId,
        title: formData.title,
        description: formData.description,
        comments: formData.comments,
        appointmentDate: formData.appointmentDate,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        treatment: formData.treatment,
        status: formData.status,
        nextDate: formData.nextDate || undefined,
        files: uploadedFiles,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_INCIDENT', payload: newIncident });
      toast.success('Appointment created successfully');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments,
      appointmentDate: incident.appointmentDate,
      cost: incident.cost?.toString() || '',
      treatment: incident.treatment || '',
      status: incident.status,
      nextDate: incident.nextDate || '',
    });
    setUploadedFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = (incident: Incident) => {
    const patient = state.patients.find(p => p.id === incident.patientId);
    if (window.confirm(`Are you sure you want to delete the appointment "${incident.title}" for ${patient?.name}?`)) {
      dispatch({ type: 'DELETE_INCIDENT', payload: incident.id });
      toast.success('Appointment deleted successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success-100 text-success-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadFile = (file: FileAttachment) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage patient appointments and treatments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-medical-600 hover:bg-medical-700" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIncident ? 'Edit Appointment' : 'New Appointment'}
              </DialogTitle>
              <DialogDescription>
                {editingIncident ? 'Update appointment details' : 'Schedule a new patient appointment'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient *</Label>
                  <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date & Time *</Label>
                  <Input
                    id="appointmentDate"
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Dental Cleaning, Root Canal"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Describe the treatment or procedure"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  rows={2}
                  placeholder="Additional notes or observations"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Input
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    placeholder="Treatment provided"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextDate">Next Appointment</Label>
                  <Input
                    id="nextDate"
                    type="datetime-local"
                    value={formData.nextDate}
                    onChange={(e) => setFormData({...formData, nextDate: e.target.value})}
                  />
                </div>
              </div>
              
              {/* File Upload */}
              <div className="space-y-2">
                <Label>File Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload invoices, X-rays, or other treatment files
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max 10MB per file. PDF, images, and documents supported.
                    </p>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {editingIncident && editingIncident.files.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Existing Files:</p>
                      <div className="space-y-2">
                        {editingIncident.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadFile(file)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-medical-600 hover:bg-medical-700">
                  {editingIncident ? 'Update Appointment' : 'Create Appointment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments by title, description, or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const patient = state.patients.find(p => p.id === incident.patientId);
          return (
            <Card key={incident.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{incident.title}</h3>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{patient?.name}</p>
                    <p className="text-sm text-gray-500">{incident.description}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(incident)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(incident)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{format(parseISO(incident.appointmentDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{format(parseISO(incident.appointmentDate), 'h:mm a')}</span>
                  </div>
                  {incident.cost && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>${incident.cost}</span>
                    </div>
                  )}
                  {incident.files.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{incident.files.length} file{incident.files.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                
                {incident.treatment && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Treatment:</strong> {incident.treatment}</p>
                  </div>
                )}
                
                {incident.comments && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm"><strong>Comments:</strong> {incident.comments}</p>
                  </div>
                )}
                
                {incident.files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {incident.files.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(file)}
                          className="flex items-center space-x-2"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">{file.name}</span>
                          <Download className="h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by scheduling your first appointment'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-medical-600 hover:bg-medical-700">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentManagement;
