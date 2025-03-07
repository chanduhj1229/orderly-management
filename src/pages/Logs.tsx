
import { useState, useMemo } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { format, parseISO } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, InfoIcon } from "lucide-react";

const Logs = () => {
  const { logs, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  // Filter logs based on search query and action type
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = log.productName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesAction =
        actionFilter === "all" || log.actionType === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, actionFilter]);

  // Format timestamp
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Get action color
  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "Added":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Updated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground">
          Track all product-related activities
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="Added">Added</SelectItem>
            <SelectItem value="Updated">Updated</SelectItem>
            <SelectItem value="Deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <InfoIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1">No logs found</h3>
          <p className="text-muted-foreground">
            {searchQuery || actionFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Activity logs will appear here once you perform actions on products"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-background rounded-xl shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Product ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                        log.actionType
                      )}`}
                    >
                      {log.actionType}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{log.productName}</TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell className="font-mono text-xs">{log.productId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Logs;
