import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService, pickupService } from '../../services/api';
import { SchedulePickupRequest, Vehicle } from '../../types';
import { Button, Input, Select, Card } from '../../components/ui';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const SchedulePickup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<SchedulePickupRequest>({ vehicleId: id || '', pickupDate: '', slot: 'MORNING' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
        vehicleService.getById(id).then(setVehicle).catch(() => navigate('/owner'));
        setFormData(prev => ({ ...prev, vehicleId: id }));
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pickupService.schedule(formData);
      navigate(`/owner/vehicle/${id}`);
    } catch (error) {
      console.error("Schedule failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(`/owner/vehicle/${id}`)} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vehicle
      </button>

      <Card title="Schedule Pickup">
         <div className="bg-primary-50 p-6 rounded-2xl mb-8 flex items-start sm:items-center gap-5 border border-primary-100">
             <div className="w-14 h-14 bg-white text-primary-600 rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-primary-100">
                 <Calendar className="w-7 h-7" />
             </div>
             <div>
                 <h3 className="font-bold text-xl text-slate-900">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                 <p className="text-slate-600 mt-1">Choose a convenient date and time for our authorized dealer to collect your vehicle.</p>
             </div>
         </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-500" /> Select Date</span>
                        </label>
                        <input
                            type="date"
                            value={formData.pickupDate}
                            onChange={e => setFormData({...formData, pickupDate: e.target.value})}
                            required
                            className="w-full appearance-none px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm font-medium"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>
                    
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" /> Time Slot</span>
                        </label>
                        <select
                            value={formData.slot}
                            onChange={e => setFormData({...formData, slot: e.target.value})}
                            required
                            className="w-full appearance-none px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm font-medium"
                        >
                            <option value="MORNING">Morning (9:00 AM - 12:00 PM)</option>
                            <option value="AFTERNOON">Afternoon (12:00 PM - 4:00 PM)</option>
                            <option value="EVENING">Evening (4:00 PM - 7:00 PM)</option>
                        </select>
                    </div>
                </div>
            </div>
          
          <div className="pt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(`/owner/vehicle/${id}`)}>Cancel</Button>
            <Button type="submit" isLoading={loading} className="px-8 shadow-lg shadow-primary-500/20">Confirm Schedule</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SchedulePickup;