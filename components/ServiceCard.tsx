import React from 'react';
import { ServiceItem } from '../types';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  // Dynamically render the icon
  const IconComponent = (Icons as any)[service.icon] || Icons.Smartphone;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-opacity group-hover:opacity-100"></div>
      
      <div className="relative z-10 flex items-start justify-between mb-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <IconComponent size={24} />
        </div>
        <span className="font-semibold text-blue-600 text-sm bg-blue-50 px-3 py-1 rounded-full">
          {service.price}
        </span>
      </div>
      
      <div className="relative z-10">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{service.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{service.description}</p>
        <div className="mt-3 flex items-center text-xs text-gray-400">
          <Icons.Clock size={12} className="mr-1" />
          {service.duration}
        </div>
      </div>
    </div>
  );
};