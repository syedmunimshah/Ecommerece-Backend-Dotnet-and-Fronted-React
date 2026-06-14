"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusBadge } from "@/features/orders/OrderStatusBadge";
import { bffApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { OrderDto } from "@/types/order";
import type { PagedResponse } from "@/types/api";

export function StoreOrdersManager() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await bffApi.get<PagedResponse<OrderDto>>("/orders/seller", {
        params: { page, size: 10 },
      });
      setOrders(data.Data || []);
      setTotalRecords(data.TotalRecords || 0);
    } catch {
      // Fail silently or handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Store Orders</h2>
        <span className="text-sm text-muted">{totalRecords} orders containing your items</span>
      </div>

      {!orders.length ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border">
          <ClipboardList className="h-12 w-12 text-muted/40 mb-3" />
          <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
          <p className="text-sm text-muted max-w-sm">
            Customers haven't purchased any of your products yet. Keep your stock up-to-date to attract buyers!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.Id} className="p-5 border border-border bg-surface/40 hover:bg-surface/60 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base">Order #{order.Id}</p>
                    <OrderStatusBadge status={order.Status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Placed on {formatDate(order.CreatedDate)}</span>
                    <span>·</span>
                    <span>Buyer ID: #{order.UserId}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted block">Total Order Amount</span>
                  <span className="text-lg font-bold text-accent">{formatCurrency(order.TotalAmount)}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Items ordered</p>
                <div className="space-y-2">
                  {order.Items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1">
                      <div className="flex items-center gap-2">
                        <Badge tone="default" className="text-xs">
                          Qty: {item.Quantity}
                        </Badge>
                        <span className="font-medium">{item.ProductName}</span>
                      </div>
                      <span className="text-muted font-mono">{formatCurrency(item.Price)} each</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
