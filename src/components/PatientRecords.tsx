
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  DollarSign,
  Calendar,
  Stethoscope,
  ClipboardList,
  Activity
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const PatientRecords: React.FC = () => {
  const { state } = useApp();
  
  if (!state.currentUser?.patientId) {
    return <div>Patient information not found</div>;
  }

  const patient = state.patients.find(p => p.id === state.currentUser?.patientId);
  const patientIncidents = state.incidents.filter(i => i.patientId === state.currentUser?.patientId);
  
  const completedTreatments = patientIncidents
    .filter(i => i.status === 'Completed')
    .sort((a, b) => parseISO(b.appointmentDate).getTime() - parseISO(a.appointmentDate).getTime());

  const totalSpent = completedTreatments
    .filter(i => i.cost)
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
        <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
        <p className="text-gray-600">View your dental treatment history and medical records</p>
      </div>

      {/* Health Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-medical-600" />
            </div>
            <div>
              <h2 className="text-xl">Health Summary</h2>
              <p className="text-sm text-gray-600">Overview of your dental health</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedTreatments.length}</div>
              <div className="text-sm text-gray-600">Completed Treatments</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${totalSpent}</div>
              <div className="text-sm text-gray-600">Total Treatment Cost</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {patientIncidents.reduce((sum, i) => sum + i.files.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Medical Documents</div>
            </div>
          </div>
          
          {patient.healthInfo && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                <Stethoscope className="h-4 w-4 mr-2" />
                Health Information
              </h4>
              <p className="text-sm text-yellow-700">{patient.healthInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5" />
            Treatment Records
          </CardTitle>
          <CardDescription>Detailed history of all your dental treatments</CardDescription>
        </CardHeader>
        <CardContent>
          {completedTreatments.length > 0 ? (
            <div className="space-y-6">
              {completedTreatments.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-6 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                      <p className="text-gray-600 mt-1">{incident.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        {incident.status}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(parseISO(incident.appointmentDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  {incident.treatment && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-medium text-green-800 mb-2">Treatment Provided</h4>
                      <p className="text-sm text-green-700">{incident.treatment}</p>
                    </div>
                  )}
                  
                  {incident.comments && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-800 mb-2">Doctor's Notes</h4>
                      <p className="text-sm text-blue-700">{incident.comments}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-6">
                      {incident.cost && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">${incident.cost}</span>
                          <span className="text-sm text-gray-500">Treatment Cost</span>
                        </div>
                      )}
                      
                      {incident.files.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            {incident.files.length} document{incident.files.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {incident.nextDate && (
                      <div className="text-sm text-blue-600 font-medium">
                        Follow-up: {format(parseISO(incident.nextDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                  
                  {incident.files.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-800 mb-3">Medical Documents</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {incident.files.map((file, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            className="flex items-center justify-between p-3 h-auto"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-xs truncate">{file.name}</span>
                            </div>
                            <Download className="h-3 w-3 ml-2 flex-shrink-0" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Treatment Records</h3>
              <p className="text-gray-500">Your treatment records will appear here after completing appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecords;
