import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { ServiceCard } from '../components/ServiceCard';
import { Search } from 'lucide-react';

interface ServicesViewProps {
  onBookService: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onBookService }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 pt-4 pb-24 space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search repairs..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onClick={() => onBookService(service.id)} 
          />
        ))}
        {filteredServices.length === 0 && (
          <div className="text-center py-10 text-gray-400 col-span-full">
            <p>No services found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};