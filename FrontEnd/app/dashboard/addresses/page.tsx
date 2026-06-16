"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { readStorage, writeStorage } from "@/lib/localStorage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  phone: string;
}

const KEY = "edgecart_addresses";

export default function AddressesPage() {
  const dispatch = useAppDispatch();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setAddresses(readStorage<Address[]>(KEY, []));
  }, []);

  const save = (list: Address[]) => {
    setAddresses(list);
    writeStorage(KEY, list);
  };

  const onAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const addr: Address = {
      id: crypto.randomUUID(),
      label: fd.get("label") as string,
      street: fd.get("street") as string,
      city: fd.get("city") as string,
      phone: fd.get("phone") as string,
    };
    save([...addresses, addr]);
    setShowForm(false);
    dispatch(pushToast({ tone: "success", message: "Address saved." }));
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={onAdd} className="grid gap-4 sm:grid-cols-2">
            <FormField label="Label (Home, Office…)"><Input name="label" required /></FormField>
            <FormField label="Phone"><Input name="phone" required /></FormField>
            <FormField label="Street Address"><Input name="street" required className="sm:col-span-2" /></FormField>
            <FormField label="City"><Input name="city" required /></FormField>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">Save Address</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {addresses.length === 0 ? (
        <EmptyState icon={<MapPin className="h-16 w-16" />} title="No saved addresses" description="Add a shipping address for faster checkout." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{a.label}</p>
                  <p className="mt-1 text-sm text-muted">{a.street}, {a.city}</p>
                  <p className="text-sm text-muted">{a.phone}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(a.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete address?"
        message="This address will be permanently removed."
        destructive
        onConfirm={() => {
          save(addresses.filter((a) => a.id !== deleteId));
          setDeleteId(null);
          dispatch(pushToast({ tone: "info", message: "Address deleted." }));
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
