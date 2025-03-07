
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Product, useProducts } from "@/contexts/ProductContext";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

// Predefined categories for demo
const CATEGORIES = ["Electronics", "Audio", "Wearables", "Accessories", "Gaming", "Computers"];

const ProductForm = ({ open, onClose, productToEdit }: ProductFormProps) => {
  const { addProduct, updateProduct, isLoading } = useProducts();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isValid, setIsValid] = useState(false);
  
  // Reset form when opening/closing or changing product
  useEffect(() => {
    if (open && productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setStock(productToEdit.stock.toString());
      setCategory(productToEdit.category);
    } else if (open && !productToEdit) {
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
    }
  }, [open, productToEdit]);
  
  // Validate form
  useEffect(() => {
    const nameValid = name.trim() !== "";
    const priceValid = !isNaN(Number(price)) && Number(price) > 0;
    const stockValid = !isNaN(Number(stock)) && Number(stock) >= 0;
    const categoryValid = category !== "";
    
    setIsValid(nameValid && priceValid && stockValid && categoryValid);
  }, [name, price, stock, category]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    const productData = {
      name,
      price: Number(price),
      stock: Number(stock),
      category,
    };
    
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
      } else {
        await addProduct(productData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };
  
  if (!open) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {productToEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <div className="loader h-4 w-4 border-2 border-current border-t-white"></div>
                ) : productToEdit ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductForm;
