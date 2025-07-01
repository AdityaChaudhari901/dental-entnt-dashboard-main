
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';

const PatientView: React.FC = () => {
  const { state } = useApp();
  
  if (!state.currentUser?.patientId) {
    return <div>Patient information not found</div>;
  }

  const patient = state.patients.find(p => p.id === state.currentUser?.patientId);
  const patientIncidents = state.incidents.filter(i => i.patientId === state.currentUser?.patientId);
  
  const upcomingAppointments = patientIncidents
    .filter(i => isAfter(parseISO(i.appointmentDate), new Date()))
    .sort((a, b) => parseISO(a.appointmentDate).getTime() - parseISO(b.appointmentDate).getTime());

  const pastAppointments = patientIncidents
    .filter(i => !isAfter(parseISO(i.appointmentDate), new Date()))
    .sort((a, b) => parseISO(b.appointmentDate).getTime() - parseISO(a.appointmentDate).getTime());

  const totalSpent = patientIncidents
    .filter(i => i.status === 'Completed' && i.cost)
    .reduce((sum, i) => sum + (i.cost || 0), 0);

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">View your dental appointments and treatment history</p>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-medical-600" />
            </div>
            <div>
              <h2 className="text-xl">{patient.name}</h2>
              <p className="text-sm text-gray-600">Patient Profile</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{patient.contact}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Born {format(parseISO(patient.dob), 'MMM dd, yyyy')}</span>
              </div>
              {patient.address && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-medical-50 rounded-lg">
                <div className="text-2xl font-bold text-medical-600">{patientIncidents.length}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600">${totalSpent}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>
          
          {patient.healthInfo && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-1">Health Information</h4>
              <p className="text-sm text-yellow-700">{patient.healthInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled dental appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-medical-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <p className="text-gray-600">{incident.description}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {incident.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(parseISO(incident.appointmentDate), 'EEEE, MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{format(parseISO(incident.appointmentDate), 'h:mm a')}</span>
                    </div>
                  </div>
                  
                  {incident.comments && (
                    <div className="mt-3 p-3 bg-white/70 rounded border-l-4 border-blue-300">
                      <p className="text-sm"><strong>Notes:</strong> {incident.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
              <p className="text-gray-500">Contact your dentist to schedule your next visit</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment History */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment History</CardTitle>
          <CardDescription>Your past appointments and treatments</CardDescription>
        </CardHeader>
        <CardContent>
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{incident.title}</h3>
                      <p className="text-gray-600 text-sm">{incident.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={
                          incident.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {incident.status}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">
                        {format(parseISO(incident.appointmentDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  {incident.treatment && (
                    <div className="mb-3 p-3 bg-green-50 rounded border-l-4 border-green-300">
                      <p className="text-sm"><strong>Treatment:</strong> {incident.treatment}</p>
                    </div>
                  )}
                  
                  {incident.comments && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border-l-4 border-blue-300">
                      <p className="text-sm"><strong>Notes:</strong> {incident.comments}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {incident.cost && (
                        <div className="flex items-center space-x-1 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">${incident.cost}</span>
                        </div>
                      )}
                      
                      {incident.files.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{incident.files.length} file{incident.files.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    
                    {incident.nextDate && (
                      <div className="text-sm text-blue-600">
                        Next: {format(parseISO(incident.nextDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                  
                  {incident.files.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No treatment history</h3>
              <p className="text-gray-500">Your treatment history will appear here after your first appointment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientView;
