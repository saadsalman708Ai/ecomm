export const calculateDeliveryCharges = (uniqueProductCount: number, perItemCharge: number = 226) => {
  return uniqueProductCount * perItemCharge;
};
