"use client";

import { motion } from "framer-motion";
import { Pencil, X } from "lucide-react";

interface EditModeToggleProps {
  isEditMode: boolean;
  onToggle: () => void;
}

export default function EditModeToggle({
  isEditMode,
  onToggle,
}: EditModeToggleProps) {
  return (
    <div className="fixed bottom-5 right-6 z-50 flex flex-col gap-3">
      <motion.button
        onClick={onToggle}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 text-white ${
          isEditMode
            ? "bg-red-500 hover:bg-red-600"
            : "bg-cyan-500 hover:bg-cyan-600"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        title={isEditMode ? "Salir del modo edición" : "Editar menú"}
      >
        {isEditMode ? (
          <X size={24} className="animate-pulse" />
        ) : (
          <Pencil size={24} />
        )}
      </motion.button>
    </div>
  );
}
