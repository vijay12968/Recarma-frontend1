import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../services/api';
import { Vehicle } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { Plus, ArrowRight, Car, Activity, Calendar as CalendarIcon } from 'lucide-react';
import { STATUS_LABELS } from '../constants';

const OwnerDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getMyVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Helper to render calendar widget
  const CalendarDate = ({ dateStr }: { dateStr: string }) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return (
      <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg overflow-hidden w-12 shadow-sm shrink-0 mr-3">
        <div className="bg-primary-50 text-primary-700 text-[9px] font-extrabold uppercase w-full text-center py-0.5 border-b border-primary-100">
          {month}
        </div>
        <div className="text-base font-bold text-slate-900 py-0.5 leading-none">
          {day}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">My Vehicles</h1>
           <p className="text-slate-600 text-sm mt-1">Manage your vehicle disposals and track status.</p>
        </div>
        <Button onClick={() => navigate('/owner/create-vehicle')}>
          <Plus className="w-4 h-4 mr-2" /> Register Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           [1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-xl"></div>)
        ) : vehicles.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No vehicles registered</h3>
             <p className="text-slate-500 mb-6">Register your end-of-life vehicle to get started.</p>
             <Button onClick={() => navigate('/owner/create-vehicle')}>Register one now</Button>
          </div>
        ) : (
          vehicles.map((v, index) => (
            <Card key={v.id || index} className="relative group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500 flex flex-col h-full bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{v.year} {v.make} {v.model}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">ID: {v.id || 'N/A'}</p>
                </div>
                <Badge color={v.status === 'COD_ISSUED' ? 'green' : 'blue'}>
                  {STATUS_LABELS[v.status] || v.status}
                </Badge>
              </div>
              
              <div className="space-y-4 text-sm text-slate-600 mb-6 flex-grow">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Condition:</span>
                  <span className="font-semibold text-slate-900">{v.conditionScore}/10</span>
                </div>
                
                {v.pickupDate ? (
                  <div className="flex items-center">
                    <CalendarDate dateStr={v.pickupDate} />
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium uppercase">Pickup Scheduled</span>
                        <span className="font-bold text-primary-700">{new Date(v.pickupDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                   <div className="flex items-center gap-2 text-slate-400">
                       <CalendarIcon className="w-4 h-4" />
                       <span className="italic">No pickup scheduled</span>
                   </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <Link to={v.id ? `/owner/vehicle/${v.id}` : '#'} className={v.status === 'CREATED' ? '' : 'col-span-2'}>
                      <Button variant="ghost" className="w-full justify-center border border-slate-200 hover:bg-slate-50 font-semibold">
                          Details
                      </Button>
                  </Link>
                  
                  {v.status === 'CREATED' && v.id && (
                    <Link to={`/owner/schedule-pickup/${v.id}`}>
                      <Button variant="primary" className="w-full justify-center shadow-lg shadow-primary-500/20 font-bold">
                          Schedule
                      </Button>
                    </Link>
                  )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;