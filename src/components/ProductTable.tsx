
import { useState } from "react";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product, useProducts } from "@/contexts/ProductContext";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductTable = ({ products, onEdit }: ProductTableProps) => {
  const { deleteProduct } = useProducts();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const sortedProducts = [...products].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    // Handle date fields
    if (sortField === "createdAt" || sortField === "updatedAt") {
      valueA = new Date(valueA as string).getTime();
      valueB = new Date(valueB as string).getTime();
    }
    
    if (valueA < valueB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
  
  const handleDelete = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };
  
  const closeDeleteDialog = () => {
    setProductToDelete(null);
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[30%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Product
                {sortField === "name" && (
                  <ArrowUpDown 
                    className={`ml-2 h-4 w-4 transition-transform ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`} 
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="w-[15%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">
                Category
                {sortField === "category" && (
                  <ArrowUpDown 
                    className={`ml-2 h-4 w-4 transition-transform ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`} 
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="w-[15%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center">
                Price
                {sortField === "price" && (
                  <ArrowUpDown 
                    className={`ml-2 h-4 w-4 transition-transform ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`} 
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="w-[15%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("stock")}
            >
              <div className="flex items-center">
                Stock
                {sortField === "stock" && (
                  <ArrowUpDown 
                    className={`ml-2 h-4 w-4 transition-transform ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`} 
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="w-[15%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("updatedAt")}
            >
              <div className="flex items-center">
                Updated
                {sortField === "updatedAt" && (
                  <ArrowUpDown 
                    className={`ml-2 h-4 w-4 transition-transform ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`} 
                  />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[10%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock} units</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(product.updatedAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setProductToDelete(product)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={!!productToDelete} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {productToDelete?.name}
              </span>{" "}
              from your product inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <div className="loader h-4 w-4 border-2"></div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductTable;
