export interface StaticPageContent {
  title: string;
  subtitle?: string;
  sections: { heading?: string; body: string[] }[];
}

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  help: {
    title: "Help Center",
    subtitle: "Find answers to common questions",
    sections: [
      {
        heading: "Orders & Delivery",
        body: [
          "Track your order from the Track Order page using your order ID.",
          "Standard delivery takes 3–5 business days across major cities.",
          "Free shipping applies on orders above Rs. 3,500.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "We support cards, bank transfer, and SafePay wallet.",
          "All transactions are encrypted and PCI-compliant.",
        ],
      },
    ],
  },
  contact: {
    title: "Contact Us",
    subtitle: "We're here to help",
    sections: [
      {
        body: [
          "Email: syedmuunim@gmail.com",
          "Phone: +92 315 8582321",
          "Hours: 24/7 customer support",
          "Office: Karachi, Pakistan",
        ],
      },
    ],
  },
  "ai-assistant": {
    title: "AI Shopping Assistant",
    subtitle: "The chat bubble in the bottom-right corner",
    sections: [
      {
        heading: "What it is",
        body: [
          "A shopping assistant that can actually read your data — not a scripted FAQ bot. It searches the live catalogue, opens your cart, and looks up your orders, so what it tells you is what our database says right now.",
          "Sign in first. The bubble only appears for signed-in customers, because it answers questions about your cart and your orders.",
        ],
      },
      {
        heading: "How to open it",
        body: [
          "Look for the round blue bubble in the bottom-right corner of any page, and click it.",
          "The search box at the top of the page is ordinary product search — it does not talk to the assistant.",
        ],
      },
      {
        heading: "What to ask it",
        body: [
          "\"What phones do you have under 50,000?\" — searches the catalogue and shows you what fits.",
          "\"Tell me more about the second one\" — pulls that product's price, stock and seller.",
          "\"What's in my cart?\" — reads your cart back to you.",
          "\"Add two of those to my cart\" — confirms with you, then actually adds them.",
          "\"Show me my orders\" — your recent orders with status and total.",
          "\"Where is order 14?\" — that order's status plus its full tracking history.",
        ],
      },
      {
        heading: "What it will not do",
        body: [
          "It cannot place an order, take a payment, or cancel anything — those stay in your hands.",
          "It cannot see another customer's cart or orders. Every lookup runs as you, based on your sign-in, so no amount of asking will change whose data it reads.",
          "It has no refund or complaint powers. For those it will point you to Contact Us rather than invent a policy.",
        ],
      },
      {
        heading: "If it is not working",
        body: [
          "No bubble in the corner? You are signed out — sign in and it appears.",
          "Says the assistant is unavailable? The service is switched off on this server, or is briefly busy. Nothing else on EdgeCart is affected.",
        ],
      },
    ],
  },
  // "track-order" is not here on purpose — it is a real page with a real form,
  // at app/track-order/page.tsx, wired to the order-tracking API.
  returns: {
    title: "Returns & Refunds",
    subtitle: "Hassle-free returns within 7 days",
    sections: [
      {
        body: [
          "Items must be unused and in original packaging.",
          "Refunds are processed within 5–7 business days after inspection.",
          "Contact support to initiate a return.",
        ],
      },
    ],
  },
  "merchant-terms": {
    title: "Merchant Terms",
    subtitle: "Terms for sellers on EdgeCart",
    sections: [
      {
        body: [
          "Sellers must provide accurate product listings and maintain stock levels.",
          "EdgeCart charges a commission on each successful sale.",
          "Payouts are processed weekly to verified bank accounts.",
        ],
      },
    ],
  },
  "selling-guide": {
    title: "Selling Guide",
    subtitle: "Start selling in 4 easy steps",
    sections: [
      {
        heading: "1. Register as Seller",
        body: ["Create an account and submit your seller profile for approval."],
      },
      {
        heading: "2. List Products",
        body: ["Add photos, descriptions, and competitive pricing."],
      },
      {
        heading: "3. Fulfill Orders",
        body: ["Pack and ship orders within 48 hours of confirmation."],
      },
      {
        heading: "4. Get Paid",
        body: ["Receive weekly payouts directly to your bank account."],
      },
    ],
  },
  "success-stories": {
    title: "Success Stories",
    subtitle: "Sellers thriving on EdgeCart",
    sections: [
      {
        heading: "Tech Store Karachi",
        body: ["Grew from 10 to 500+ orders per month within 6 months."],
      },
      {
        heading: "Fashion Hub Lahore",
        body: ["Reached Rs. 2M monthly revenue selling nationwide."],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      {
        body: [
          "EdgeCart collects personal data to process orders and improve your experience.",
          "We never sell your data to third parties.",
          "You may request data deletion by contacting syedmuunim@gmail.com.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        body: [
          "By using EdgeCart you agree to our marketplace rules and policies.",
          "Users must be 18+ to make purchases.",
          "EdgeCart reserves the right to suspend accounts that violate policies.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    sections: [
      {
        body: [
          "We use cookies to remember your preferences and cart items.",
          "Analytics cookies help us improve the platform.",
          "You can disable cookies in your browser settings.",
        ],
      },
    ],
  },
};
