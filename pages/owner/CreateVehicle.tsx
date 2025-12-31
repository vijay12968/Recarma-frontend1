import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/api';
import { CreateVehicleRequest } from '../../types';
import { Button, Input, Card } from '../../components/ui';
import { ArrowLeft } from 'lucide-react';

const CreateVehicle: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateVehicleRequest>({ make: '', model: '', year: 2010, conditionScore: 5 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehicleService.create(formData);
      navigate('/owner');
    } catch (error) {
      console.error("Create failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/owner')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      <Card title="Register New Vehicle">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                label="Make" 
                value={formData.make} 
                onChange={e => setFormData({...formData, make: e.target.value})} 
                placeholder="e.g. Honda" 
                required 
            />
            <Input 
                label="Model" 
                value={formData.model} 
                onChange={e => setFormData({...formData, model: e.target.value})} 
                placeholder="e.g. City" 
                required 
            />
            <Input 
                label="Year" 
                type="number" 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} 
                required 
            />
            <div>
                <Input 
                    label="Condition Score (1-10)" 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={formData.conditionScore} 
                    onChange={e => setFormData({...formData, conditionScore: parseInt(e.target.value)})} 
                    required 
                />
                <p className="text-xs text-gray-500 mt-[-15px]">10 is excellent, 1 is scrap.</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/owner')}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Register Vehicle</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateVehicle;