"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface ProductInfoTabsProps {
  product: {
    description: string
    specs: Array<{ label: string; value: string }>
  }
}

export function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState("description")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
    { id: "shipping", label: "Shipping & Returns" },
    { id: "faq", label: "FAQ" },
  ]

  const faqs = [
    {
      id: "faq1",
      question: "What is the warranty period?",
      answer: "All products come with a 2-year manufacturer warranty covering defects in materials and workmanship.",
    },
    {
      id: "faq2",
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 150 countries. Shipping costs and delivery times vary by location.",
    },
    {
      id: "faq3",
      question: "Can I return the product if I change my mind?",
      answer: "Yes, we offer a 30-day money-back guarantee. Items must be in original condition with all packaging.",
    },
    {
      id: "faq4",
      question: "Is this product compatible with my device?",
      answer: "This product is compatible with all devices supporting Bluetooth 5.0 and later.",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "description" && (
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {product.specs.map((spec, index) => (
              <div key={index} className="flex justify-between rounded-lg border border-border p-4">
                <span className="font-medium text-muted-foreground">{spec.label}</span>
                <span className="font-semibold text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 text-foreground">
            <div>
              <h3 className="font-semibold mb-2">Shipping</h3>
              <p className="text-muted-foreground">
                We offer free shipping on orders over $50. Standard shipping takes 5-7 business days. Express shipping
                (2-3 days) is available for an additional fee.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Returns</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee. Items must be in original condition with all packaging and
                accessories. Return shipping is free for defective items.
              </p>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground text-left">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-muted-foreground transition-transform ${
                      expandedFaq === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <div className="border-t border-border bg-muted/30 p-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
