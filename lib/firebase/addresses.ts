import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";
import { Address } from "@/types";

const addressesCollection = (userId: string) =>
  collection(db, "users", userId, "addresses");

export async function getAddresses(userId: string): Promise<Address[]> {
  const snapshot = await getDocs(addressesCollection(userId));
  const list = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    isDefault: !!d.data().isDefault,
  })) as Address[];
  list.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  return list;
}

export async function getAddressById(
  userId: string,
  addressId: string
): Promise<Address | null> {
  const ref = doc(db, "users", userId, "addresses", addressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), isDefault: !!snap.data().isDefault } as Address;
}

export async function addAddress(
  userId: string,
  address: Omit<Address, "id">
): Promise<string> {
  const ref = doc(addressesCollection(userId));
  const newAddress = {
    ...address,
    id: ref.id,
  };
  await setDoc(ref, newAddress);
  return ref.id;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: Partial<Address>
): Promise<void> {
  const ref = doc(db, "users", userId, "addresses", addressId);
  await updateDoc(ref, data as Record<string, unknown>);
}

export async function setDefaultAddress(
  userId: string,
  addressId: string
): Promise<void> {
  const refs = await getDocs(addressesCollection(userId));
  const batch: Promise<void>[] = [];
  refs.docs.forEach((d) => {
    batch.push(
      updateDoc(d.ref, { isDefault: d.id === addressId })
    );
  });
  await Promise.all(batch);
}

export async function deleteAddress(
  userId: string,
  addressId: string
): Promise<void> {
  const ref = doc(db, "users", userId, "addresses", addressId);
  await deleteDoc(ref);
}
