import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService, documentService } from '../../services/api';
import { Vehicle } from '../../types';
import { Button, Select, Card } from '../../components/ui';
import { ArrowLeft, Upload, FileCheck } from 'lucide-react';

const UploadDocs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [docType, setDocType] = useState('RC');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
        vehicleService.getById(id).then(setVehicle).catch(() => navigate('/owner'));
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !id) return;
    setLoading(true);
    try {
      await documentService.upload(id, docType, file);
      alert("Document uploaded successfully!");
      navigate(`/owner/vehicle/${id}`);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(`/owner/vehicle/${id}`)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vehicle
      </button>

      <Card title="Upload Documents">
         <div className="bg-emerald-50 p-4 rounded-xl mb-6 flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                 <FileCheck className="w-6 h-6" />
             </div>
             <div>
                 <h3 className="font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                 <p className="text-sm text-gray-600">Upload RC and Insurance details for verification.</p>
             </div>
         </div>

        <form onSubmit={handleSubmit}>
            <Select label="Document Type" value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="RC">Registration Certificate (RC)</option>
              <option value="INSURANCE">Insurance Copy</option>
              <option value="ID_PROOF">Owner ID Proof</option>
            </Select>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
              <div className="flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-500 transition-colors cursor-pointer bg-gray-50 group">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  {file && <p className="text-sm font-bold text-primary-700 bg-primary-50 py-1 px-3 rounded-full inline-block">{file.name}</p>}
                </div>
              </div>
            </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(`/owner/vehicle/${id}`)}>Cancel</Button>
            <Button type="submit" isLoading={loading} disabled={!file}>Upload Document</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadDocs;