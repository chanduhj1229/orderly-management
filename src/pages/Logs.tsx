
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ClipboardList, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts, Log } from "@/contexts/ProductContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Logs = () => {
  const { logs, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter logs based on search and action type
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesSearch = log.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesAction =
          actionFilter === "all" || log.actionType === actionFilter;
        return matchesSearch && matchesAction;
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [logs, searchQuery, actionFilter, sortOrder]);

  // Get action type badge color
  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "Added":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Updated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Deleted":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            Track all product-related activities
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Action Type</h4>
                  <Select
                    value={actionFilter}
                    onValueChange={setActionFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="Added">Added</SelectItem>
                      <SelectItem value="Updated">Updated</SelectItem>
                      <SelectItem value="Deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Sort Order</h4>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex">
                <div className="mr-4 flex-shrink-0">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">No activity logs found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || actionFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Activity logs will appear here once products are added, updated, or deleted"}
            </p>
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-muted space-y-8 pb-6">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary" />
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium">{log.productName}</span>
                  <Badge
                    variant="outline"
                    className={`${getActionColor(log.actionType)}`}
                  >
                    {log.actionType}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(log.timestamp)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
