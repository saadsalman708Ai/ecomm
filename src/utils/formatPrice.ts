export const formatPrice = (price: number) => {
  return `PKR. ${price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
