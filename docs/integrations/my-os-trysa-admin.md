# YomiOnalaru MY OS ↔ TRYSA identity and data contract

**STATUS 2026-11-04: GitHub code only — no production SSO, no CRM synchronization.**

## Problem and resolution

The original YomiOnalaru Owner PIN screen checked `ADMIN_EMAIL` and `ADMIN_PIN`
on YomiOnalaru's separate Supabase/Worker project. Production lacked the PIN
setting. Signing up for a separate site account does not grant MY OS access.

This implementation makes **TRYSA the identity provider and CRM/bookings backend**.
The site never asks for a TRYSA PIN or password. It redirects to TRYSA's
existing sign-in and OAuth consent flow, then independently verifies the
identity returned from TRYSA against the owner's pinned **immutable TRYSA user
UUID**. An arbitrary matching email or site signup is not enough.

## Security boundaries

- `/auth`: TRYSA-first, with existing staff Supabase/Google login retained
  solely for separately authorized content-studio roles. The dead Yomi-specific
  owner PIN and confusing public signup were removed from this login UI.
- `/admin/my-os`: only a pinned TRYSA owner session grants access. The
  parent admin shell makes no TRYSA-to-Supabase-role elevation. All other
  YomiOnalaru admin routes keep their original local role guards.
- `/api/auth/trysa/start`: validates a same-site origin and begins
  authorization-code + PKCE S256 with random state/verifier protected in
  AES-256-GCM sealed HttpOnly Secure SameSite=Lax transaction cookie.
- `/api/auth/trysa/callback`: verifies state, obtains tokens server-to-server
  using confidential OAuth client authentication and PKCE, calls TRYSA
  `/api/public/onaru/oauth/me` with the access token to retrieve a verified
  subject and consented workspace, compares the subject to the pinned owner
  UUID, then issues a short-lived encrypted HttpOnly owner-only cookie.
- `/api/admin/myos-owner-session` and
  `/api/admin/myos-trysa-status`: both call the owner verifier on each
  request. The verifier validates the cookie and re-introspects the TRYSA
  access token, making revoked grants fail closed.
- Owner session never grants rights to other CMS/admin routes, and no local
  browser code receives the TRYSA OAuth access/refresh tokens.
- A valid TRYSA login does not automatically authorize **all** workspaces.
  The user must separately approve each workspace under TRYSA's existing
  consent rules. Current preview supports one selected workspace per session;
  a durable multi-workspace grant registry does not yet exist.
- No customer records are moved to a new database and no CRM or booking
  writes are implemented.
- The existing MY OS ↔ TRYSA bilateral signing contract is separate from SSO
  and must be independently activated before CRM data is shared.

## Provisioning — do not commit values

The dedicated TRYSA OAuth client **`yomionalaru_myos` is not registered**.
Register it via authorized TRYSA operator workflow with exact redirect URL
`https://yomionalaru.com/api/auth/trysa/callback`, PKCE S256 enforced,
client secret hashed on TRYSA server, and allowed scopes restricted to
`workspaces.read clients.read bookings.read`.
Do not rotate the existing `onaru_os` client credentials.

Set these **Cloudflare Worker server-side secrets only**, under the correct
production/staging environment:
- `MYOS_TRYSA_CLIENT_SECRET`: dedicated TRYSA OAuth confidential client secret
- `MYOS_TRYSA_OWNER_SUB`: immutable owner UUID, independently verified in TRYSA
- `MYOS_TRYSA_COOKIE_KEY_B64`: 32 random bytes base64url encoded; rotate on
  suspected exposure (rotation invalidates prior sessions)
- `MYOS_PUBLIC_ORIGIN`: `https://yomionalaru.com` in production
- Bilateral contract variables: `MYOS_TRYSA_CONTRACT_DIGEST`,
  `MYOS_TRYSA_TRUSTED_PUBLIC_KEYS_JSON`, `MYOS_TRYSA_ATTESTATIONS_JSON`,
  `MYOS_TRYSA_KEY_ID`, `MYOS_TRYSA_PRIVATE_KEY_PEM` (independently signed)

No variables are `VITE_*`. Do not paste secrets, client PIN, OAuth tokens,
private keys or customer data into a chat, commit, issue, PR or browser console.

## Release blockers / acceptance checks

- [ ] TRYSA identity endpoint on the actual live `own-stack` deployment.
- [ ] Dedicated OAuth client registered and known owner identity verified.
- [ ] Stage YomiOnalaru Worker in isolated environment, ensure exact
      callback URL is registered for that deployment.
- [ ] Verify a correct TRYSA login can select an approved workspace and return.
- [ ] Reject a different TRYSA account with identical display name/email.
- [ ] Reject altered state, expired codes, missing PIN, revoked authorization,
      denied workspace, expired cookies, wrong owner UUID and wrong OAuth client.
- [ ] Confirm anonymous callers and ordinary site staff cannot load MY OS.
- [ ] Confirm MY OS login grants no YomiOnalaru CMS/editor/super-admin rights.
- [ ] Validate refresh/session UX. Current session expires within 15 minutes;
      long-lived login requires server-side refresh-token rotation, not
      long-lived browser tokens.
- [ ] Complete bilateral cryptographic attestation and negative tests before
      enabling any MY OS CRM/bookings read.
- [ ] Test iPhone Safari and mobile navigation on staging.
- [ ] Confirm production deployment only after owner and security review.

**Do not merge or deploy as a working SSO until these are verified.** The
Current GitHub build validates compilation only, not a real login.
