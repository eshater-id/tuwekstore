# Security Specification - FashionVibe

## Data Invariants
1. Products can only be created/updated by authenticated admins.
2. Store settings can only be modified by admins.
3. Visitors can only read products and settings (read-only).
4. Product clicks can be incremented via update (if we implement it, but for now we'll restrict it to admin for simplicity or implement a specific increment rule).
5. All price fields must be numbers > 0.
6. WhatsApp number must be a valid string format.

## The Dirty Dozen (Attacks to block)
1. Anonymous user trying to create a product.
2. Authenticated non-admin trying to delete a product.
3. User trying to change the price of a product to a negative number.
4. User trying to set their own role as admin in a document.
5. Batch writing 1000 fields to a product doc (Denial of Wallet).
6. Injecting script tags into product description.
7. Spoofing `updatedAt` with a client-side timestamp.
8. Deleting the root settings document.
9. Modifying someone else's user profile (if we had one).
10. Reading private admin docs.
11. Querying for "isVerified: true" on a collection where it shouldn't be.
12. Accessing products via invalid ID strings (Resource Poisoning).

## Test Runner Plan
We will use `firestore_rules_test.ts` to verify:
- Public READ access to /products and /settings/store.
- Permission DENIED for WRITE access without Admin role.
- Validation logic for Product fields (price size, stock types).
