import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Calendar, Smartphone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingViewProps {
  preSelectedServiceId?: string;
  onSuccess: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ preSelectedServiceId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: preSelectedServiceId || '',
    device: '',
    date: '',
    name: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (id: string) => {
    setFormData(prev => ({ ...prev, serviceId: id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep(3);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1000);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500">We've received your request. You'll receive a confirmation SMS shortly.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 pb-24">
      <div className="flex items-center space-x-2 mb-8">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">What do you need fixed?</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SERVICES.map(service => (
                <div 
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.serviceId === service.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                >
                  <p className={`font-semibold text-sm ${formData.serviceId === service.id ? 'text-blue-700' : 'text-gray-700'}`}>{service.name}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Device Details</h2>
            <Input 
              name="device"
              placeholder="e.g. iPhone 13 Pro Max"
              label="Device Model"
              value={formData.device}
              onChange={handleInputChange}
            />

            <Button 
              type="button" 
              fullWidth 
              className="mt-8"
              onClick={() => setStep(2)}
              disabled={!formData.serviceId || !formData.device}
            >
              Next Step
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">When & Who?</h2>
            
            <div className="space-y-4">
              <Input 
                type="date"
                name="date"
                label="Preferred Date"
                value={formData.date}
                onChange={handleInputChange}
                className="block w-full"
              />
              
              <Input 
                name="name"
                label="Your Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
              
              <Input 
                type="tel"
                name="phone"
                label="Phone Number"
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex space-x-3 mt-8">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                fullWidth 
                className="flex-[2]"
                disabled={!formData.date || !formData.name || !formData.phone}
              >
                Confirm Booking
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};