
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  parseISO,
  isToday,
  getDay
} from 'date-fns';

const CalendarView: React.FC = () => {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return state.incidents.filter(incident => {
      const appointmentDate = parseISO(incident.appointmentDate);
      return isSameDay(appointmentDate, date);
    });
  };

  // Navigate months
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const appointments = getAppointmentsForDate(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isDayToday = isToday(day);

      days.push(
        <div
          key={day.toString()}
          className={`relative min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
            !isCurrentMonth ? 'bg-gray-100 text-gray-400' : ''
          } ${isSelected ? 'bg-medical-50 border-medical-300' : ''} ${
            isDayToday ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${
              isDayToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {formattedDate}
            </span>
            {appointments.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1">
                {appointments.length}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            {appointments.slice(0, 3).map((appointment) => {
              const patient = state.patients.find(p => p.id === appointment.patientId);
              const appointmentTime = format(parseISO(appointment.appointmentDate), 'h:mm a');
              
              return (
                <div
                  key={appointment.id}
                  className={`text-xs p-1 rounded truncate ${
                    appointment.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                  title={`${appointmentTime} - ${patient?.name} - ${appointment.title}`}
                >
                  <div className="font-medium">{appointmentTime}</div>
                  <div className="truncate">{patient?.name}</div>
                </div>
              );
            })}
            
            {appointments.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{appointments.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
        <p className="text-gray-600">Manage appointments and view schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Calendar Header */}
              <div className="grid grid-cols-7 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Body */}
              <div className="space-y-0">
                {rows}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>
                  {selectedDate 
                    ? format(selectedDate, 'MMM dd, yyyy')
                    : 'Select a Date'
                  }
                </span>
              </CardTitle>
              {selectedDate && (
                <CardDescription>
                  {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? 's' : ''}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent>
              {selectedDate ? (
                selectedDateAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateAppointments
                      .sort((a, b) => parseISO(a.appointmentDate).getTime() - parseISO(b.appointmentDate).getTime())
                      .map((appointment) => {
                        const patient = state.patients.find(p => p.id === appointment.patientId);
                        return (
                          <div key={appointment.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {format(parseISO(appointment.appointmentDate), 'h:mm a')}
                                </span>
                              </div>
                              <Badge 
                                className={
                                  appointment.status === 'Completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : appointment.status === 'Scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{patient?.name}</span>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm">{appointment.title}</h4>
                              <p className="text-xs text-gray-600">{appointment.description}</p>
                            </div>
                            
                            {appointment.cost && (
                              <div className="text-sm font-medium text-green-600">
                                ${appointment.cost}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No appointments scheduled</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click on a date to view appointments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Appointments</span>
                  <span className="font-medium">
                    {state.incidents.filter(incident => 
                      isSameMonth(parseISO(incident.appointmentDate), currentDate)
                    ).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {state.incidents.filter(incident => 
                      isSameMonth(parseISO(incident.appointmentDate), currentDate) &&
                      incident.status === 'Completed'
                    ).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Scheduled</span>
                  <span className="font-medium text-blue-600">
                    {state.incidents.filter(incident => 
                      isSameMonth(parseISO(incident.appointmentDate), currentDate) &&
                      incident.status === 'Scheduled'
                    ).length}
                  </span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-medium text-green-600">
                      ${state.incidents
                        .filter(incident => 
                          isSameMonth(parseISO(incident.appointmentDate), currentDate) &&
                          incident.status === 'Completed' &&
                          incident.cost
                        )
                        .reduce((sum, incident) => sum + (incident.cost || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
