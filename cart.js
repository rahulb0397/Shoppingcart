// Shopping Cart System with Discounts, Taxes, and Receipt Generation

// Sample data
const cartItems = [
  { id: 1, name: "Shampoo", category: "Personal Care", price: 200, quantity: 3, discount: 10 }, // 10% item discount
  { id: 2, name: "Toothpaste", category: "Personal Care", price: 100, quantity: 2 }, // no item discount
  { id: 3, name: "Notebook", category: "Stationery", price: 50, quantity: 5 },
  { id: 4, name: "Pen", category: "Stationery", price: 10, quantity: 12 },
];

const categoryDiscounts = {
  "Stationery": 5, // 5% off category-level
};

const buyXGetYFree = {
  4: { x: 2, y: 1 }, // Buy 2 Pens get 1 free
};

const promoCodes = {
  "WELCOME10": { type: "percentage", value: 10 },
  "SAVE50": { type: "fixed", value: 50 },
};

const taxRates = {
  "Personal Care": 18,
  "Stationery": 5,
};

let appliedPromoCode = "WELCOME10"; // simulate user-applied promo code

function applyDiscount(item) {
  let discount = 0;

  if (item.discount) {
    discount = (item.price * item.discount) / 100;
  } else if (categoryDiscounts[item.category]) {
    discount = (item.price * categoryDiscounts[item.category]) / 100;
  }

  return item.price - discount;
}

function applyBuyXGetY(item) {
  const offer = buyXGetYFree[item.id];
  if (!offer) return item.quantity;

  const groups = Math.floor(item.quantity / (offer.x + offer.y));
  const remaining = item.quantity % (offer.x + offer.y);
  return groups * offer.x + Math.min(remaining, offer.x);
}

function calculateTax(price, category) {
  const taxRate = taxRates[category] || 0;
  return (price * taxRate) / 100;
}

function calculateCartTotal(cartItems) {
  let subtotal = 0;
  let totalTax = 0;
  let receiptLines = [];

  for (const item of cartItems) {
    const effectiveQty = applyBuyXGetY(item);
    const finalPricePerItem = applyDiscount(item);
    const totalPrice = finalPricePerItem * effectiveQty;
    const tax = calculateTax(totalPrice, item.category);

    subtotal += totalPrice;
    totalTax += tax;

    receiptLines.push(
      `${item.name} x${item.quantity} (paid for ${effectiveQty}): ₹${totalPrice.toFixed(2)} + Tax ₹${tax.toFixed(2)}`
    );
  }

  let discountFromPromo = 0;
  if (promoCodes[appliedPromoCode]) {
    const promo = promoCodes[appliedPromoCode];
    discountFromPromo = promo.type === "percentage"
      ? (subtotal * promo.value) / 100
      : promo.value;
  }

  const total = subtotal + totalTax - discountFromPromo;

  return {
    receipt: receiptLines,
    subtotal,
    totalTax,
    discountFromPromo,
    total,
  };
}

function printReceipt() {
  const summary = calculateCartTotal(cartItems);

  console.log("Receipt:");
  summary.receipt.forEach(line => console.log("-", line));
  console.log("Subtotal: ₹" + summary.subtotal.toFixed(2));
  console.log("Tax: ₹" + summary.totalTax.toFixed(2));
  if (summary.discountFromPromo > 0) {
    console.log(`Promo (${appliedPromoCode}): -₹${summary.discountFromPromo.toFixed(2)}`);
  }
  console.log("Total: ₹" + summary.total.toFixed(2));
}

printReceipt();
