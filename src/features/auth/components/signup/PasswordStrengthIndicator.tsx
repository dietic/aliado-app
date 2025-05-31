import React from 'react';
import { Check, X } from 'lucide-react';

// Components
export const PasswordStrengthIndicator: React.FC<{
  label: string;
  isValid: boolean;
}> = React.memo(({ label, isValid }) => (
  <div className="flex items-center">
    {isValid ? (
      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
    ) : (
      <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
    )}
    <p className={`text-xs ${isValid ? 'text-green-600' : 'text-slate-500'}`}>{label}</p>
  </div>
));

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';
