
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

// API URL
const API_URL = 'http://localhost:5000/api';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load products and logs on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsRes = await fetch(`${API_URL}/products`);
        const productsData = await productsRes.json();
        
        if (productsData.success) {
          // Transform the data to match our frontend model
          const transformedProducts = productsData.data.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          }));
          
          setProducts(transformedProducts);
        }
        
        // Fetch logs
        const logsRes = await fetch(`${API_URL}/logs`);
        const logsData = await logsRes.json();
        
        if (logsData.success) {
          // Transform the data to match our frontend model
          const transformedLogs = logsData.data.map((log: any) => ({
            id: log._id,
            actionType: log.actionType,
            productId: log.productId,
            productName: log.productName,
            timestamp: log.timestamp
          }));
          
          setLogs(transformedLogs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add product');
      }
      
      const newProduct: Product = {
        id: data.data._id,
        name: data.data.name,
        price: data.data.price,
        stock: data.data.stock,
        category: data.data.category,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
      };
      
      setProducts((prev) => [...prev, newProduct]);
      
      // Refresh logs to get the new log entry
      const logsRes = await fetch(`${API_URL}/logs`);
      const logsData = await logsRes.json();
      
      if (logsData.success) {
        const transformedLogs = logsData.data.map((log: any) => ({
          id: log._id,
          actionType: log.actionType,
          productId: log.productId,
          productName: log.productName,
          timestamp: log.timestamp
        }));
        
        setLogs(transformedLogs);
      }
      
      toast.success(`Product "${newProduct.name}" added successfully`);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }
      
      const updatedProduct: Product = {
        id: data.data._id,
        name: data.data.name,
        price: data.data.price,
        stock: data.data.stock,
        category: data.data.category,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
      };
      
      setProducts((prev) => 
        prev.map((product) => 
          product.id === id ? updatedProduct : product
        )
      );
      
      // Refresh logs to get the new log entry
      const logsRes = await fetch(`${API_URL}/logs`);
      const logsData = await logsRes.json();
      
      if (logsData.success) {
        const transformedLogs = logsData.data.map((log: any) => ({
          id: log._id,
          actionType: log.actionType,
          productId: log.productId,
          productName: log.productName,
          timestamp: log.timestamp
        }));
        
        setLogs(transformedLogs);
      }
      
      toast.success(`Product "${updatedProduct.name}" updated successfully`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    
    try {
      const productToDelete = products.find((product) => product.id === id);
      
      if (!productToDelete) {
        throw new Error('Product not found');
      }
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      setProducts((prev) => prev.filter((product) => product.id !== id));
      
      // Refresh logs to get the new log entry
      const logsRes = await fetch(`${API_URL}/logs`);
      const logsData = await logsRes.json();
      
      if (logsData.success) {
        const transformedLogs = logsData.data.map((log: any) => ({
          id: log._id,
          actionType: log.actionType,
          productId: log.productId,
          productName: log.productName,
          timestamp: log.timestamp
        }));
        
        setLogs(transformedLogs);
      }
      
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
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
