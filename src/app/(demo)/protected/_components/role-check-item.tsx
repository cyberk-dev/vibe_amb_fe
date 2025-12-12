import { CheckCircle, XCircle } from "lucide-react";

interface RoleCheckItemProps {
  hookName: string;
  isGranted: boolean;
}

export const RoleCheckItem = ({ hookName, isGranted }: RoleCheckItemProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <code className="text-xs sm:text-sm break-all">{hookName}</code>
      </div>
      <div className="flex items-center gap-2">
        {isGranted ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600">True</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-600">False</span>
          </>
        )}
      </div>
    </div>
  );
};
