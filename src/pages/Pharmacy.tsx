import { useState, useCallback, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Star, Loader2, ImageIcon } from "lucide-react";
import PrescriptionUpload from "@/components/pharmacy/PrescriptionUpload";
import { ProductService } from "@/services/api/product-service";
import { Product } from "@/services/api/types";
import { useQuery } from "@tanstack/react-query";

const productService = new ProductService();

const Pharmacy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await productService.getProducts();
    }
  });

  // Memoize the filter function to prevent recreation on each render
  const filterProducts = useCallback((productList: Product[], type: string) => {
    if (type === "all") return productList;
    if (type === "prescription") return productList.filter(p => p.prescription);
    return productList.filter(p => !p.prescription);
  }, []);

  // Memoize the filtered results based on products, searchTerm, and filterType
  const searchResults = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const filtered = filterProducts(products, filterType);
    
    if (!searchTerm.trim()) {
      return filtered;
    }
    
    return filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm, filterType, filterProducts]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Search results",
      description: `Found ${searchResults.length} products matching "${searchTerm}"`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 dark:text-gray-400">Error loading products</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-gradient-to-br from-mediwrap-blue/10 to-mediwrap-green/10 dark:from-mediwrap-blue/5 dark:to-mediwrap-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Online Pharmacy & Medicine Delivery
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find and purchase medicines from trusted online pharmacies
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <PrescriptionUpload />
            </div>
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <div className="w-full">
                <h3 className="text-lg font-medium mb-4">Search Products</h3>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Search medicines and health products"
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" className="ml-2 bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Tabs defaultValue="all" className="">
            <TabsList>
              <TabsTrigger 
                value="all" 
                onClick={() => setFilterType("all")}
              >
                All Products
              </TabsTrigger>
              <TabsTrigger 
                value="otc" 
                onClick={() => setFilterType("otc")}
              >
                Over The Counter
              </TabsTrigger>
              <TabsTrigger 
                value="prescription" 
                onClick={() => setFilterType("prescription")}
              >
                Prescription Only
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {!product.image ? (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  ) : (
                    <img 
                      src={product.image} 
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        const parent = target.parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'flex flex-col items-center justify-center h-full w-full text-gray-400';
                          placeholder.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
                              <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span class="text-sm">Image unavailable</span>
                          `;
                          parent.innerHTML = '';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  )}
                  {product.prescription && (
                    <div className="absolute top-2 left-2 bg-mediwrap-blue text-white text-xs px-2 py-1 rounded">
                      Prescription Required
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <div className="mb-2 flex items-center">
                    <span className="text-sm text-mediwrap-green font-medium">{product.category}</span>
                    <div className="ml-auto flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-mediwrap-blue dark:text-mediwrap-blue-light">₹{product.price.toFixed(2)}</p>
                  <Button
                    className="w-full mt-4 bg-mediwrap-blue hover:bg-mediwrap-blue/90"
                    onClick={() => window.open(product.buyUrl || 'https://www.1mg.com', '_blank')}
                  >
                    {product.prescription ? "Buy with Prescription" : "Buy Now"}
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No products found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Pharmacy;
