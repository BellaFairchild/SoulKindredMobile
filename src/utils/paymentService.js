// src/utils/paymentService.js
// Replace with Stripe/RevenueCat/etc integrations later.

export async function fetchPlans() {
  return [
    { id: "starter", name: "Starter", price: "$4.99", perks: ["Daily check-ins", "AI chat"] },
    { id: "plus", name: "Plus", price: "$9.99", perks: ["Everything in Starter", "Voice replies"] },
    { id: "pro", name: "Pro", price: "$14.99", perks: ["Everything in Plus", "Priority support"] }
  ];
}

export async function startSubscription(planId) {
  console.log("startSubscription (stub)", planId);
  return { success: true, planId };
}
