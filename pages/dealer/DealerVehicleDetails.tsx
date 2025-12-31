import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/api';
import { Vehicle, VehicleStatus } from '../../types';
import { Card, Badge, Button, Select } from '../../components/ui';
import { STATUS_LABELS, VEHICLE_STATUSES } from '../../constants';
import { ArrowLeft, User, Calendar, AlertTriangle, CheckCircle2, ArrowRight, Truck, Gavel, FileCheck, PackageCheck } from 'lucide-react';

const DealerVehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<VehicleStatus | ''>('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && id !== 'undefined') {
        vehicleService.getById(id)
            .then(data => {
                setVehicle(data);
                setStatus(data.status);
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                setError("Could not retrieve vehicle details. Please check the ID or contact support.");
            })
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
        setError("Invalid Vehicle ID provided.");
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus?: VehicleStatus) => {
    const statusToUpdate = newStatus || status;
    if (!id || !statusToUpdate) return;
    
    setUpdating(true);
    try {
      await vehicleService.updateStatus(id, { status: statusToUpdate as VehicleStatus });
      // Refresh local data instead of full navigate to show immediate change
      const updatedVehicle = await vehicleService.getById(id);
      setVehicle(updatedVehicle);
      setStatus(updatedVehicle.status);
      alert(`Vehicle status updated to ${STATUS_LABELS[statusToUpdate]}`);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update status");
    } finally {
        setUpdating(false);
    }
  };

  const getNextStatus = (current: VehicleStatus): VehicleStatus | null => {
      switch (current) {
          case VehicleStatus.CREATED: return VehicleStatus.PICKUP_SCHEDULED;
          case VehicleStatus.PICKUP_SCHEDULED: return VehicleStatus.IN_TRANSIT;
          case VehicleStatus.IN_TRANSIT: return VehicleStatus.RECEIVED;
          case VehicleStatus.RECEIVED: return VehicleStatus.DISMANTLED;
          case VehicleStatus.DISMANTLED: return VehicleStatus.COD_ISSUED;
          default: return null;
      }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div><p className="text-slate-600 font-medium">Loading details...</p></div>;

  if (error || !vehicle) return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Vehicle</h2>
          <p className="text-slate-600 mb-8">{error || "Vehicle information is unavailable."}</p>
          <Button onClick={() => navigate('/dealer')}>Back to Dashboard</Button>
      </div>
  );

  const nextStatus = getNextStatus(vehicle.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dealer')} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-bold text-sm transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-md border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                        <p className="text-sm text-slate-500 font-mono mt-2 font-medium">ID: {vehicle.id}</p>
                    </div>
                    <Badge color={vehicle.status === 'COD_ISSUED' ? 'green' : 'blue'}>
                        {STATUS_LABELS[vehicle.status]}
                    </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Condition</span>
                        <span className="font-extrabold text-3xl text-slate-900">{vehicle.conditionScore}<span className="text-lg text-slate-400">/10</span></span>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                         <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Pickup Date</span>
                         <span className="font-bold text-xl text-slate-900">
                             {vehicle.pickupDate ? new Date(vehicle.pickupDate).toLocaleDateString() : 'N/A'}
                         </span>
                    </div>
                </div>

                {/* Timeline Visualization */}
                <div className="border-t border-slate-100 pt-8 pb-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-wide">Lifecycle Progress</h3>
                    <div className="flex items-center justify-between relative px-4">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full mx-4"></div>
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-primary-200 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 mx-4"
                            style={{ width: `${(VEHICLE_STATUSES.indexOf(vehicle.status) / (VEHICLE_STATUSES.length - 1)) * 100}%` }}
                        ></div>

                        {[
                            { s: VehicleStatus.PICKUP_SCHEDULED, icon: Calendar },
                            { s: VehicleStatus.IN_TRANSIT, icon: Truck },
                            { s: VehicleStatus.RECEIVED, icon: PackageCheck },
                            { s: VehicleStatus.DISMANTLED, icon: Gavel },
                            { s: VehicleStatus.COD_ISSUED, icon: FileCheck }
                        ].map(({ s, icon: Icon }, idx) => {
                            const currentIdx = VEHICLE_STATUSES.indexOf(vehicle.status);
                            const stepIdx = VEHICLE_STATUSES.indexOf(s);
                            const isCompleted = stepIdx <= currentIdx;
                            const isCurrent = stepIdx === currentIdx;

                            return (
                                <div key={s} className="flex flex-col items-center gap-3 relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isCompleted 
                                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                            : 'bg-white border-slate-200 text-slate-300'
                                    } ${isCurrent ? 'ring-4 ring-primary-100 scale-110' : ''}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide text-center w-20 ${isCompleted ? 'text-primary-700' : 'text-slate-300'}`}>
                                        {STATUS_LABELS[s]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
             <Card title="Workflow Actions" className="bg-white shadow-md border border-slate-200">
                {nextStatus ? (
                    <div className="mb-8">
                        <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl mb-4">
                            <h4 className="text-primary-900 font-bold mb-1">Next Step Recommended</h4>
                            <p className="text-primary-700 text-sm font-medium">Move vehicle to <span className="font-bold underline decoration-primary-300 decoration-2">{STATUS_LABELS[nextStatus]}</span></p>
                        </div>
                        <Button 
                            onClick={() => handleStatusUpdate(nextStatus)} 
                            isLoading={updating}
                            className="w-full py-4 text-lg shadow-lg shadow-primary-500/20"
                        >
                            Mark as {STATUS_LABELS[nextStatus]} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                ) : (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl mb-6 text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <h4 className="text-emerald-900 font-bold text-lg">Process Completed</h4>
                        <p className="text-emerald-700 text-sm font-medium">No further actions required.</p>
                    </div>
                )}

                <div className="border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                         <AlertTriangle className="w-4 h-4 text-amber-500" />
                         <h4 className="text-sm font-bold text-slate-700">Manual Override</h4>
                    </div>
                    <div className="space-y-3">
                        <Select
                            label="Set Status Manually"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                        >
                            {VEHICLE_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                            </option>
                            ))}
                        </Select>
                        
                        <Button variant="outline" onClick={() => handleStatusUpdate()} className="w-full font-semibold" isLoading={updating}>
                            Update Status
                        </Button>
                    </div>
                </div>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default DealerVehicleDetails;