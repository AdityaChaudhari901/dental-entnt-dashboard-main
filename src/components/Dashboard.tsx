import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar, Users, DollarSign, Activity, Clock,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const isAdmin = state.currentUser?.role === 'Admin';

  const now = new Date();
  const nextWeek = addDays(now, 7);

  const upcomingAppointments = state.incidents
    .filter(incident => {
      const date = parseISO(incident.appointmentDate);
      return isAfter(date, now) && isBefore(date, nextWeek);
    })
    .sort((a, b) => parseISO(a.appointmentDate).getTime() - parseISO(b.appointmentDate).getTime())
    .slice(0, 10);

  const completedTreatments = state.incidents.filter(i => i.status === 'Completed').length;
  const pendingTreatments = state.incidents.filter(i => i.status !== 'Completed').length;

  const totalRevenue = state.incidents
    .filter(i => i.status === 'Completed' && i.cost)
    .reduce((sum, i) => sum + (i.cost || 0), 0);

  const topPatients = state.patients.map(patient => {
    const appointments = state.incidents.filter(i => i.patientId === patient.id);
    const totalSpent = appointments.filter(i => i.status === 'Completed' && i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);
    return { ...patient, appointmentCount: appointments.length, totalSpent };
  }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const patientIncidents = state.currentUser?.patientId
    ? state.incidents.filter(i => i.patientId === state.currentUser.patientId)
    : [];

  const patientUpcoming = patientIncidents
    .filter(i => isAfter(parseISO(i.appointmentDate), now))
    .sort((a, b) => parseISO(a.appointmentDate).getTime() - parseISO(b.appointmentDate).getTime());

  const patientTotalSpent = patientIncidents
    .filter(i => i.status === 'Completed' && i.cost)
    .reduce((sum, i) => sum + (i.cost || 0), 0);

  // ✨ Patient View
  if (!isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-black">My Dashboard</h1>
          <p className="text-gray-600">Welcome back to your dental care portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Appointments', value: patientIncidents.length, icon: <Calendar className="text-blue-500" /> },
            { title: 'Upcoming', value: patientUpcoming.length, icon: <Clock className="text-yellow-500" /> },
            { title: 'Completed', value: patientIncidents.filter(i => i.status === 'Completed').length, icon: <CheckCircle className="text-green-500" /> },
            { title: 'Total Spent', value: `$${patientTotalSpent.toLocaleString()}`, icon: <DollarSign className="text-emerald-500" /> },
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <div className="w-5 h-5">{item.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled dental appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {patientUpcoming.length > 0 ? (
              <div className="space-y-4">
                {patientUpcoming.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="flex justify-between p-4 border rounded-xl hover:bg-gray-50 transition">
                    <div>
                      <h4 className="font-semibold">{incident.title}</h4>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                      <p className="text-xs text-gray-500">{format(parseISO(incident.appointmentDate), 'PPP p')}</p>
                    </div>
                    <Badge variant={incident.status === 'Scheduled' ? 'default' : 'secondary'}>
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✨ Admin View
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dental center management portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Patients', value: state.patients.length, icon: <Users className="text-blue-500" />, subtitle: 'Active patient database' },
          { title: 'Pending Treatments', value: pendingTreatments, icon: <AlertCircle className="text-orange-500" />, subtitle: 'Require attention' },
          { title: 'Completed Treatments', value: completedTreatments, icon: <CheckCircle className="text-green-500" />, subtitle: 'Successfully finished' },
          { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-emerald-500" />, subtitle: 'Total from treatments' },
        ].map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className="w-5 h-5">{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next 10 scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((incident) => {
                  const patient = state.patients.find(p => p.id === incident.patientId);
                  return (
                    <div key={incident.id} className="flex justify-between p-3 border rounded-xl hover:bg-gray-50 transition">
                      <div>
                        <h4 className="font-semibold">{patient?.name}</h4>
                        <p className="text-sm text-gray-600">{incident.title}</p>
                        <p className="text-xs text-gray-500">{format(parseISO(incident.appointmentDate), 'MMM dd, p')}</p>
                      </div>
                      <Badge variant="outline">{incident.status}</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments in the next week</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Top Patients</CardTitle>
            <CardDescription>Based on total spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPatients.map((patient, index) => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center text-sm font-semibold text-medical-800">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-500">{patient.appointmentCount} appointments</p>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-medical-700">
                    ${patient.totalSpent.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
