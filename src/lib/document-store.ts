import type { DocumentKind, HealthDocument } from "./types";

const DB_NAME = "health-app-db";
const DB_VERSION = 1;
const STORE = "documents";

export const DOCS_CHANGE_EVENT = "health-docs-change";

export interface StoredDocument extends HealthDocument {
  blob: Blob;
}

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DOCS_CHANGE_EVENT));
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("memberId", "memberId", { unique: false });
        store.createIndex("examDate", "examDate", { unique: false });
      }
    };
  });
}

export function createDocumentId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function saveDocument(
  meta: HealthDocument,
  blob: Blob
): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).put({ ...meta, blob });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notifyChange();
}

export async function listDocumentsByMember(
  memberId: string
): Promise<HealthDocument[]> {
  const db = await openDB();
  const rows = await new Promise<StoredDocument[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).index("memberId").getAll(memberId);
    req.onsuccess = () => resolve(req.result as StoredDocument[]);
    req.onerror = () => reject(req.error);
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  const meta = rows.map(({ blob: _, ...rest }) => rest);
  return meta.sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );
}

export async function getDocumentBlob(id: string): Promise<Blob | null> {
  const db = await openDB();
  const row = await new Promise<StoredDocument | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as StoredDocument | undefined);
    req.onerror = () => reject(req.error);
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return row?.blob ?? null;
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notifyChange();
}

export function detectKind(file: File): DocumentKind {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  return "image";
}

export const MAX_FILE_SIZE = 15 * 1024 * 1024;
