
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: string;
  actionType: 'Added' | 'Updated' | 'Deleted';
  productId: string;
  productName: string;
  timestamp: string;
}

interface ProductContextType {
  products: Product[];
  logs: Log[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Mock initial data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    price: 1299.99,
    stock: 10,
    category: 'Electronics',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 199.99,
    stock: 25,
    category: 'Audio',
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 299.99,
    stock: 15,
    category: 'Wearables',
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
];

const mockLogs: Log[] = [
  {
    id: '1',
    actionType: 'Added',
    productId: '1',
    productName: 'Laptop Pro',
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
  },
  {
    id: '2',
    actionType: 'Added',
    productId: '2',
    productName: 'Wireless Headphones',
    timestamp: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
  },
  {
    id: '3',
    actionType: 'Updated',
    productId: '1',
    productName: 'Laptop Pro',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load mock data on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLogs(mockLogs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productData,
          createdAt: now,
          updatedAt: now,
        };
        
        setProducts((prev) => [...prev, newProduct]);
        
        const newLog: Log = {
          id: Date.now().toString(),
          actionType: 'Added',
          productId: newProduct.id,
          productName: newProduct.name,
          timestamp: now,
        };
        
        setLogs((prev) => [...prev, newLog]);
        toast.success(`Product "${newProduct.name}" added successfully`);
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        
        setProducts((prev) => 
          prev.map((product) => 
            product.id === id 
              ? { ...product, ...productData, updatedAt: now } 
              : product
          )
        );
        
        const updatedProduct = products.find((product) => product.id === id);
        
        if (updatedProduct) {
          const newLog: Log = {
            id: Date.now().toString(),
            actionType: 'Updated',
            productId: id,
            productName: productData.name || updatedProduct.name,
            timestamp: now,
          };
          
          setLogs((prev) => [...prev, newLog]);
          toast.success(`Product "${productData.name || updatedProduct.name}" updated successfully`);
        }
        
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const productToDelete = products.find((product) => product.id === id);
        
        if (productToDelete) {
          setProducts((prev) => prev.filter((product) => product.id !== id));
          
          const newLog: Log = {
            id: Date.now().toString(),
            actionType: 'Deleted',
            productId: id,
            productName: productToDelete.name,
            timestamp: new Date().toISOString(),
          };
          
          setLogs((prev) => [...prev, newLog]);
          toast.success(`Product "${productToDelete.name}" deleted successfully`);
        }
        
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const value = {
    products,
    logs,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
