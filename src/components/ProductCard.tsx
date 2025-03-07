
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Package } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Product, useProducts } from "@/contexts/ProductContext";

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
}

const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  const { deleteProduct } = useProducts();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProduct(product.id);
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm card-hover flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
          <Badge variant="secondary" className="font-normal">
            {product.category}
          </Badge>
        </div>
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Price</p>
          <p className="font-medium">${product.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Stock</p>
          <p className="font-medium">{product.stock} units</p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-auto pt-4 border-t">
        <p>Created: {format(new Date(product.createdAt), "MMM d, yyyy")}</p>
        <p>Updated: {format(new Date(product.updatedAt), "MMM d, yyyy")}</p>
      </div>
      
      <div className="flex justify-between mt-4 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="w-full mr-2"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {product.name}
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
    </motion.div>
  );
};

export default ProductCard;
