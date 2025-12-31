import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { pickupService } from '../services/api';
import { Pickup } from '../types';
import { Card, Badge, Button } from '../components/ui';
import { STATUS_LABELS } from '../constants';
import { Calendar, User, Truck, ArrowRight, AlertCircle, Clock } from 'lucide-react';

const DealerDashboard: React.FC = () => {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const data = await pickupService.getAll();
      // Sort: Pending/Active first, then completed
      const sorted = data.sort((a, b) => {
          const isDoneA = a.vehicle?.status === 'COD_ISSUED';
          const isDoneB = b.vehicle?.status === 'COD_ISSUED';
          if (isDoneA && !isDoneB) return 1;
          if (!isDoneA && isDoneB) return -1;
          return new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime();
      });
      setPickups(sorted);
    } catch (error) {
      console.error("Failed to fetch pickups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  // Helper to render calendar widget
  const CalendarDate = ({ dateStr }: { dateStr: string }) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return (
      <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg overflow-hidden w-14 shadow-sm shrink-0">
        <div className="bg-primary-50 text-primary-700 text-[10px] font-extrabold uppercase w-full text-center py-0.5 border-b border-primary-100">
          {month}
        </div>
        <div className="text-lg font-bold text-slate-900 py-1 leading-none">
          {day}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dealer Dashboard</h1>
           <p className="text-slate-600 font-medium mt-2">Manage assigned pickups and process vehicle scrappage.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <span className="text-sm font-semibold text-slate-500">Active Requests: </span>
            <span className="font-bold text-primary-600 text-lg ml-1">{pickups.filter(p => p.vehicle?.status !== 'COD_ISSUED').length}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-xl"></div>)}
        </div>
      ) : pickups.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
           <Truck className="w-16 h-16 mx-auto text-slate-300 mb-4" />
           <p className="text-slate-600 text-lg font-medium">No pickup requests assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pickups.map((pickup) => {
            const vehicleId = pickup.vehicle?.id;
            return (
              <Card key={pickup.id} className="transition-all hover:shadow-lg hover:-translate-y-0.5 border-l-4 border-l-primary-500 group bg-white shadow-md">
                <div className="md:flex md:justify-between md:items-center p-2">
                  <div className="flex gap-4 items-start mb-4 md:mb-0">
                     {/* Calendar Widget */}
                     <div className="hidden sm:block">
                        <CalendarDate dateStr={pickup.pickupDate} />
                     </div>

                     <div className="space-y-3">
                       <div className="flex items-center gap-3">
                         <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                           {pickup.vehicle?.year} {pickup.vehicle?.make} {pickup.vehicle?.model}
                         </h3>
                         <Badge color={pickup.vehicle?.status === 'COD_ISSUED' ? 'green' : 'blue'}>
                            {pickup.vehicle ? STATUS_LABELS[pickup.vehicle.status] : 'Unknown'}
                         </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400" /> 
                              <span className="font-semibold text-slate-800">{pickup.user?.name || 'Owner'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" /> 
                              <span className="sm:hidden font-medium">{new Date(pickup.pickupDate).toLocaleDateString()}</span>
                              <span className="hidden sm:inline font-medium text-slate-400">|</span>
                              <span className="font-medium text-primary-700">{pickup.slot}</span>
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="text-right hidden md:block mr-4">
                          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Condition</div>
                          <div className="font-bold text-slate-900 text-lg">{pickup.vehicle?.conditionScore}/10</div>
                      </div>
                      
                      {vehicleId ? (
                          <Link to={`/dealer/vehicle/${vehicleId}`} className="w-full sm:w-auto">
                               {/* Changed text color to text-primary-700 for better visibility */}
                               <Button className="w-full justify-between sm:justify-center bg-white text-primary-700 border border-slate-200 hover:bg-primary-50 hover:border-primary-300 shadow-sm font-bold transition-all">
                                  Manage Action <ArrowRight className="w-4 h-4 ml-2" />
                               </Button>
                          </Link>
                      ) : (
                          <Button disabled variant="ghost" className="w-full sm:w-auto text-red-500 cursor-not-allowed border border-transparent bg-red-50 font-semibold">
                              <AlertCircle className="w-4 h-4 mr-2" /> Action Unavailable
                          </Button>
                      )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealerDashboard;