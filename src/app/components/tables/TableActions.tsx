import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const TableActions = ({
  onView,
  onEdit,
  onDelete,
  canView = true,
  canEdit = true,
  canDelete = true,
}: TableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white text-black shadow-lg rounded-md px-4 py-2 !backdrop-blur-0 !bg-opacity-100 dark:bg-gray-400 z-50"
      >
        {canView && onView && (
          <DropdownMenuItem
            onClick={onView}
            className="flex items-center gap-1 cursor-pointer mb-2 text-gray-900 hover:text-blue-500 hover:border-none focus:outline-none"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
        )}
        {canEdit && onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center gap-1 cursor-pointer mb-2 text-gray-900 hover:text-yellow-300 hover:border-none focus:outline-none"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {canDelete && onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="flex items-center gap-1 cursor-pointer text-gray-900 hover:text-red-600 hover:border-none focus:outline-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
