
import React from 'react';
import { SERVICES } from '../../../constants';
import { ServiceCard } from './ServiceCard';

export const ServicesSection: React.FC = () => {
  return (
    <section className="container mx-auto px-6 py-16 relative">
      <h2 className="font-orbitron text-2xl text-cyan-400 mb-12 flex items-center gap-4">
        <span className="w-8 h-px bg-cyan-400"></span>
        Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
};
