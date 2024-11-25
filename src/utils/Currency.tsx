const Currency = ({ price }:any) => {
    if (isNaN(price)) {
      console.error('Invalid price:', price);
      return 'Price not available';
    }
  
    return Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(price);
  }
  
  export default Currency;