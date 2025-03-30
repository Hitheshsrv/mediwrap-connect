
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, PlusCircle, MinusCircle, CreditCard, Truck } from "lucide-react";

// Sample cart data - in a real app, this would be managed with context or state management
const initialCartItems = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 5.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    name: "Vitamin C 1000mg",
    price: 12.49,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1616671276441-2f2c2a9b1b30?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Calculate subtotal, discount, shipping, and total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = isCouponApplied ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal - discount + shipping;

  // Handle quantity change
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Handle removing item from cart
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  // Handle applying coupon code
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "MEDIWRAP10") {
      setIsCouponApplied(true);
      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    toast({
      title: "Checkout successful",
      description: "Your order has been placed successfully!",
    });
    
    // Clear cart
    setCartItems([]);
    
    // In a real app, we would redirect to an order confirmation page
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-gray-500 text-sm">Unit Price: ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="font-semibold w-20 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/pharmacy")}
                  >
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isCouponApplied}
                    />
                    <Button 
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={isCouponApplied}
                    >
                      Apply
                    </Button>
                  </div>
                  
                  {isCouponApplied && (
                    <div className="bg-green-50 p-2 text-green-700 text-sm rounded">
                      Coupon MEDIWRAP10 applied: 10% discount
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full bg-mediwrap-green hover:bg-mediwrap-green-light text-white flex items-center justify-center"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </Button>
                    
                    <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                      <Truck className="mr-2 h-4 w-4" />
                      Free shipping on orders over $50
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="text-7xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add items to your cart to continue shopping.</p>
              <Button 
                className="bg-mediwrap-blue hover:bg-mediwrap-blue-light"
                onClick={() => navigate("/pharmacy")}
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
