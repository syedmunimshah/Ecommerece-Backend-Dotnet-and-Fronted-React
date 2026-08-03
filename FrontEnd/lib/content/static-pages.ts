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
          "Email: support@edgecart.pk",
          "Phone: +92 300 1234567",
          "Hours: 24/7 customer support",
          "Office: Karachi, Pakistan",
        ],
      },
    ],
  },
  "track-order": {
    title: "Track Order",
    subtitle: "Enter your order ID to see status",
    sections: [
      {
        body: [
          "Use the form on this page to track your shipment in real time.",
          "Order IDs are sent to your email after checkout.",
        ],
      },
    ],
  },
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
          "You may request data deletion by contacting support@edgecart.pk.",
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
