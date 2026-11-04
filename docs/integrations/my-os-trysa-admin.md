# MY OS frontend handoff — YomiOnalaru.com

**Status: feature branch, not yet deployed.**

YomiOnalaru.com is the public personal-brand website and a link-only frontend
for owner MY OS. It should NOT host a second TRYSA OAuth callback, private
signing keys, client secrets, user tokens, CRM data or booking records.

## Destination

- YomiOnalaru.com `/auth` offers a **Continue with TRYSA** link to
  `https://onaru.app/my-os`.
- YomiOnalaru.com `/admin/my-os` displays a frontend-only link to
  `https://onaru.app/my-os`.
- ONARU OS is the confidential TRYSA OAuth client and owns the verified
  owner session. Callback:
  `https://onaru.app/api/auth/trysa/callback`.
- TRYSA is the identity provider and CRM/booking system of record. Owner
  access requires exact immutable TRYSA identity match and explicit
  workspace OAuth consent. Credentials never enter Yomi browser code.
- The site's separate CMS roles and staff login are unchanged.

## Retired Yomi server-side MY OS code

Removed from this feature branch:
`src/lib/myos/trysa-owner-session.server.ts`,
`src/lib/myos/trysa-contract.server.ts`,
`src/routes/api/auth/trysa/{start,callback,logout}.ts`,
`src/routes/api/admin/{myos-owner-session,myos-trysa-status}.ts`,
and the tests that depended on those server modules. Owner OAuth tests
now run in ONARU OS.

## Activation order

1. Review and merge TRYSA OAuth registration UI. Register confidential client
   suspended with exact ONARU OS redirect and minimal read scopes.
2. Provision owner-pinned OAuth secret and AES-GCM cookie key in ONARU OS
   Vercel only. Do not provision them in YomiOnalaru Cloudflare.
3. Review and validate ONARU OS OAuth broker and its owner-only privacy tests.
4. Verify real TRYSA login, consent, revocation, wrong-owner denial and
   no cross-workspace access.
5. Activate OAuth client only after an authorized operator approves tests.
6. Deploy ONARU OS first, then deploy YomiOnalaru frontend handoff.
7. Bilateral signed CRM/booking reads remain a separate explicit release gate.

**No MY OS data is shown on the Yomi site** before the separately protected
ONARU OS owner session. No live OAuth client was registered by this PR.
