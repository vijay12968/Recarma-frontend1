import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/api';
import { Vehicle, VehicleStatus } from '../../types';
import { Button, Card, Badge } from '../../components/ui';
import { ArrowLeft, Calendar, FileText, Truck, CheckCircle2 } from 'lucide-react';
import { STATUS_LABELS } from '../../constants';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      vehicleService.getById(id)
        .then(setVehicle)
        .catch(() => navigate('/owner')) // Redirect if not found
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (loading || !vehicle) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div></div>;

  const StatusStepper = ({ status }: { status: VehicleStatus }) => {
    const steps = [
      VehicleStatus.CREATED,
      VehicleStatus.PICKUP_SCHEDULED,
      VehicleStatus.IN_TRANSIT,
      VehicleStatus.RECEIVED,
      VehicleStatus.DISMANTLED,
      VehicleStatus.COD_ISSUED
    ];
    const currentIndex = steps.indexOf(status);

    return (
      <div className="py-6">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Processing Timeline</h3>
         <div className="relative">
            {steps.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                    <div key={step} className="flex gap-4 mb-8 last:mb-0 relative z-10">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                isCompleted ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-300'
                            }`}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />}
                            </div>
                            {index !== steps.length - 1 && (
                                <div className={`w-0.5 h-full absolute top-8 ${index < currentIndex ? 'bg-primary-600' : 'bg-gray-100'}`} style={{ left: '15px', height: 'calc(100% + 16px)' }}></div>
                            )}
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-primary-700' : 'text-gray-900'}`}>{STATUS_LABELS[step]}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isCurrent ? 'Current Status' : isCompleted ? 'Completed' : 'Pending'}
                            </p>
                        </div>
                    </div>
                );
            })}
         </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/owner')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Vehicles
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                        <p className="text-sm text-gray-500 font-mono mt-1">Ref ID: {vehicle.id}</p>
                    </div>
                    <Badge color={vehicle.status === 'COD_ISSUED' ? 'green' : 'blue'}>
                        {STATUS_LABELS[vehicle.status]}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Condition</span>
                        <span className="text-xl font-bold text-gray-900">{vehicle.conditionScore}/10</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                         <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Pickup Date</span>
                         <span className="text-xl font-bold text-gray-900">
                             {vehicle.pickupDate ? new Date(vehicle.pickupDate).toLocaleDateString() : 'Not Scheduled'}
                         </span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Required Actions</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {vehicle.status === VehicleStatus.CREATED ? (
                             <Button onClick={() => navigate(`/owner/schedule-pickup/${vehicle.id}`)} className="flex-1">
                                <Calendar className="w-4 h-4 mr-2" /> Schedule Pickup
                             </Button>
                        ) : (
                            <Button variant="outline" onClick={() => navigate(`/owner/upload-documents/${vehicle.id}`)} className="flex-1 bg-white border-primary-200 text-primary-700 hover:bg-primary-50">
                                <FileText className="w-4 h-4 mr-2" /> Upload Documents
                            </Button>
                        )}
                    </div>
                    {vehicle.status === VehicleStatus.CREATED && (
                         <p className="text-xs text-amber-600 mt-3 flex items-center">
                            <span className="mr-1">⚠️</span> Document upload will be available after scheduling a pickup.
                         </p>
                    )}
                </div>
            </Card>
        </div>

        {/* Right Col: Timeline */}
        <div className="lg:col-span-1">
            <Card className="h-full">
                <StatusStepper status={vehicle.status} />
            </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;