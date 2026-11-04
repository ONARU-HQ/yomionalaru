# MY OS ↔ TRYSA: YomiOnalaru.com admin integration

Status: **backend code staged / contract unsigned / CRM sync inactive**

This repository is the MY OS **consumer** for the existing TRYSA contract.
The public YomiOnalaru.com website is unchanged; these files are reached only
from the authenticated, super-admin-only `/admin/my-os` panel.

## Security requirements
- The admin page uses the existing Supabase session.
- Each `/api/admin/myos-trysa-status` request independently checks the bearer
  token against Supabase Auth, requires an unsuspended profile and a
  `super_admin` role. Never rely on React route guards alone.
- MY OS's Ed25519 private signing key exists only in the Cloudflare Worker
  secret store. Nothing sensitive is sent to the browser.
- The client verifies two independent Ed25519 contract attestations before
  attempting any network request.
- It signs the exact TRYSA v1 canonical request bytes and calls only the
  fixed HTTPS status endpoint at `trysa.app` (redirects are rejected).
- OAuth credentials are scoped to a selected, pre-approved TRYSA workspace.
  The current implementation accepts a short-lived worker secret for a
  **manual handshake only**; it has no refresh-token workflow yet.
- The status endpoint returns **no clients, keys, tokens or private data**,
  and never mutates TRYSA CRM. Actual sync is not implemented.

## Cloudflare Worker runtime secret names

Provision privately at the appropriate environment; do **not** commit values,
place them in `VITE_*`, log them, or transmit them to frontend HTML:

- `MYOS_TRYSA_CONTRACT_DIGEST`: SHA-256 hex of the final exact agreed contract
- `MYOS_TRYSA_TRUSTED_PUBLIC_KEYS_JSON`: separately verified public keys
  (`myos` and `trysa`, each with key ID, PEM and `status: "active"`)
- `MYOS_TRYSA_ATTESTATIONS_JSON`: independent, externally verified signatures
  of the same digest with the corresponding party-specific attestation payload
- `MYOS_TRYSA_KEY_ID`: MY OS's registered key ID
- `MYOS_TRYSA_WORKSPACE_ID`: explicitly approved TRYSA workspace UUID
- `MYOS_TRYSA_PRIVATE_KEY_PEM`: MY OS private Ed25519 PKCS#8 PEM, stored as
  a Worker secret; keep separate from TRYSA's key
- `MYOS_TRYSA_OAUTH_ACCESS_TOKEN`: valid workspace-approved TRYSA `onaru_os`
  OAuth access token for the minimal `clients.read` scope, stored server-side

These are **not currently configured or signed** by this PR. Without them,
the manual status check returns `not_configured`. Both backends must be
reviewed and independently signed; setting a variable alone is not consent.

## Future work before real CRM reads
1. Finish TRYSA PR #7 security review, tests and backend deployment.
2. Provision two independently controlled signing keys and validate the
   identical contract digest using the published fingerprints.
3. Register approved workspace-specific MY OS OAuth consent at TRYSA.
4. Replace the short-lived access-token secret with a server-side refresh/
   rotation mechanism; do not expose refresh credentials in the browser.
5. Add response integrity/audit logging and non-production end-to-end tests.
6. Implement redacted CRM relationships with no automatic client creation,
   and require separate approval to enable any write functionality.
7. Validate the Cloudflare Worker runtime's Node Ed25519 compatibility.
