
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: "Paracetamol",
    price: 12.99,
    quantity: 1,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Vitamin C",
    price: 24.99,
    quantity: 2,
    image: "/placeholder.svg"
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const applyPromoCode = () => {
    if (promoCode.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Promo code applied",
      description: "Your promo code has been applied successfully",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  const checkout = () => {
    toast({
      title: "Order Placed",
      description: "Your order has been placed successfully",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our pharmacy for medicines and health products.</p>
            <Button href="/pharmacy" asChild className="bg-mediwrap-blue hover:bg-mediwrap-blue-light">
              <a href="/pharmacy">Continue Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center py-4 border-b last:border-b-0">
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mr-4 mb-4 md:mb-0">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full p-2" />
                      </div>
                      
                      <div className="flex-grow mb-4 md:mb-0 text-center md:text-left">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Medicine</p>
                      </div>
                      
                      <div className="flex items-center mx-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                        <span className="mx-2 min-w-[30px] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="font-medium mr-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-medium text-lg mb-6">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex space-x-2 mb-4">
                    <Input
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>Apply</Button>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-mediwrap-blue hover:bg-mediwrap-blue-light" onClick={checkout}>
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
