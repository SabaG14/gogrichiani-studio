
import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Disc, Music, MonitorPlay } from 'lucide-react';
import { Service } from '../../../types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const IconMap: Record<string, React.ReactNode> = {
  'Gamepad2': <Gamepad2 className="w-8 h-8" />,
  'Disc': <Disc className="w-8 h-8" />,
  'Layers': <Music className="w-8 h-8" />,
  'MonitorPlay': <MonitorPlay className="w-8 h-8" />
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const icon = IconMap[service.icon] || <MonitorPlay className="w-8 h-8" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-white/10 bg-black/50 p-8 rounded transition-colors duration-300"
    >
      <div className="text-fuchsia-500 mb-4 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-orbitron text-lg font-bold mb-3 text-gray-200">{service.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
    </motion.div>
  );
};
