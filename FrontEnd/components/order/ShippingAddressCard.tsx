import type { ShippingAddressDto } from "@/lib/types/api";

/**
 * Where an order is being delivered. Shown to the customer on their own order, and to
 * admins and sellers who have to actually send it.
 *
 * Orders placed before addresses were collected have none, so this renders a plain note
 * rather than an empty card — an order with a blank address block reads as a bug.
 */
export function ShippingAddressCard({ address }: { address: ShippingAddressDto | null }) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--card-bg)] p-6">
      <h2 className="text-base font-semibold text-foreground">Delivery address</h2>

      {address ? (
        <div className="mt-4 space-y-1 text-sm">
          <p className="font-medium text-foreground">{address.name}</p>
          <p className="text-muted">
            <a href={`tel:${address.phone}`} className="hover:text-accent hover:underline">
              {address.phone}
            </a>
          </p>
          <p className="pt-2 text-foreground">{address.address}</p>
          <p className="text-foreground">
            {address.city}
            {address.postalCode ? ` ${address.postalCode}` : ""}
          </p>
          {address.notes && (
            <p className="pt-2 text-muted">
              <span className="font-medium text-foreground">Note: </span>
              {address.notes}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">
          No address was recorded for this order — it was placed before delivery details were
          collected at checkout.
        </p>
      )}
    </div>
  );
}
