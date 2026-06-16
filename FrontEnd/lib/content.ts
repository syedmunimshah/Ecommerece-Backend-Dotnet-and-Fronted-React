export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "summer-sale-tips",
    title: "Top 10 Summer Sale Shopping Tips",
    excerpt: "Maximize savings during flash sales with these expert strategies.",
    content:
      "Plan ahead, compare prices, and set alerts for your wishlist items. EdgeCart sellers offer verified deals during seasonal events — shop smart and save more.",
    author: "EdgeCart Team",
    date: "2026-06-01",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    category: "Shopping Tips",
  },
  {
    slug: "seller-success-guide",
    title: "How to Succeed as an EdgeCart Seller",
    excerpt: "A complete guide for new sellers joining our marketplace.",
    content:
      "Complete your seller profile, upload quality product images, maintain accurate stock levels, and respond quickly to orders. Approved sellers gain access to our full product management suite.",
    author: "Marketplace Team",
    date: "2026-05-15",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    category: "For Sellers",
  },
  {
    slug: "secure-online-shopping",
    title: "Stay Safe While Shopping Online",
    excerpt: "Protect your account and payments with these security best practices.",
    content:
      "Use strong passwords, never share your login credentials, and always verify order confirmations. EdgeCart uses JWT authentication and secure payment processing.",
    author: "Security Team",
    date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    category: "Security",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export const FAQ_ITEMS = [
  {
    q: "How do I track my order?",
    a: "Go to Dashboard → My Orders and click on any order to view tracking history and payment status.",
  },
  {
    q: "What is the return policy?",
    a: "We offer a 30-day return policy on most items. See our Return Policy page for full details.",
  },
  {
    q: "How do I become a seller?",
    a: "Register as a user, then submit a seller application from your dashboard. An admin will review and approve your profile.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Card, Cash, and Bank Transfer. Payment is processed after order creation during checkout.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery is 3–5 business days. Express options may be available from select sellers.",
  },
];

export const POLICY_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect account information (name, email), order history, and usage data to provide our services.",
      },
      {
        heading: "How We Use Your Data",
        body: "Your data is used to process orders, improve our platform, and communicate important updates about your account.",
      },
      {
        heading: "Data Security",
        body: "We use industry-standard encryption and JWT-based authentication to protect your account.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By using EdgeCart, you agree to these terms and our policies. Users must be 18 or older to make purchases.",
      },
      {
        heading: "Account Responsibilities",
        body: "You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        heading: "Seller Obligations",
        body: "Approved sellers must provide accurate product listings and fulfill orders in a timely manner.",
      },
    ],
  },
  returns: {
    title: "Return Policy",
    sections: [
      {
        heading: "30-Day Returns",
        body: "Most items can be returned within 30 days of delivery in original condition with tags attached.",
      },
      {
        heading: "Refund Process",
        body: "Refunds are processed within 5–7 business days after we receive and inspect the returned item.",
      },
      {
        heading: "Non-Returnable Items",
        body: "Personalized items, digital products, and perishables are not eligible for return.",
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    sections: [
      {
        heading: "Processing Time",
        body: "Orders are processed within 1–2 business days. You will receive a confirmation email with tracking details.",
      },
      {
        heading: "Shipping Rates",
        body: "Free standard shipping on orders above Rs. 5,000. Express shipping rates vary by location.",
      },
      {
        heading: "International Shipping",
        body: "Currently we ship within Pakistan. International shipping will be available soon.",
      },
    ],
  },
} as const;
