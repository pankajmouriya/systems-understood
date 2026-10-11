# Cloudflare DNS setup for `pankajmouriya.com`

- **Updated:** 2026-10-11
- **Registrar:** GoDaddy
- **Current DNS and hosting:** NS1 / Netlify
- **Target authoritative DNS:** Cloudflare
- **Application target:** Cloudflare Pages static export through GitHub Actions Direct Upload
- **Cutover policy:** Planned downtime accepted; Netlify is excluded from active Cloudflare DNS

This runbook moves DNS authority to Cloudflare without transferring the domain registration away from GoDaddy. Complete each checkpoint in order. The user accepted a planned outage between nameserver activation and the new Cloudflare application deployment. Do not delete the Netlify projects or source DNS zone until the replacement deployment has passed its hosted checks.

**Current migration status (2026-10-11):** The user reports that GoDaddy now has the assigned Cloudflare nameservers and Cloudflare zone activation is in progress. The zone intentionally has no website records during this interval. Application build and deployment are covered by [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md).

## Current public state

The following values were verified before the migration:

| Type | Name | Current value |
| --- | --- | --- |
| NS | `@` | `dns1.p06.nsone.net` |
| NS | `@` | `dns2.p06.nsone.net` |
| NS | `@` | `dns3.p06.nsone.net` |
| NS | `@` | `dns4.p06.nsone.net` |
| A | `@` | `13.215.239.219` |
| A | `@` | `52.74.6.109` |
| A or flattened alias | `www` | resolves to the same two addresses |
| MX | `@` | none found |
| TXT | `@` | none found |
| DS / DNSSEC | `@` | none found |

`https://pankajmouriya.com/` currently returns a Netlify response. `https://www.pankajmouriya.com/` redirects to the apex domain.

The Netlify domain-management screen was reviewed on 2026-10-11 and confirms:

- the existing Netlify project hostname is `quizzical-swartz-5afd76.netlify.app`;
- `pankajmouriya.com` is the primary production domain;
- `www.pankajmouriya.com` redirects automatically to the primary domain;
- both custom domains use Netlify DNS;
- HTTPS is active through a Let's Encrypt certificate covering `pankajmouriya.com` and `*.pankajmouriya.com`.

The complete Netlify DNS zone contains three provider-managed `NETLIFY` records:

| Netlify record | TTL | Netlify-managed target |
| --- | --- | --- |
| `pankajmouriya.com` | `3600` | `jolly-northcutt-b8f126.netlify.app` |
| `www.pankajmouriya.com` | `3600` | `jolly-northcutt-b8f126.netlify.app` |
| `talks.pankajmouriya.com` | `3600` | `jovial-kilby-174125.netlify.app` |

`NETLIFY` is a provider-specific record type and cannot be copied to Cloudflare as written. A hosted check also found that `jolly-northcutt-b8f126.netlify.app` now returns 404, while the current project hostname `quizzical-swartz-5afd76.netlify.app` serves the same content and ETag as `pankajmouriya.com`. `jovial-kilby-174125.netlify.app` serves the same content and ETag as `talks.pankajmouriya.com`.

The complete Netlify zone shown in the dashboard contains only these three records. No separate mail, verification, DKIM, CAA, IPv6, or other service record needs to be migrated from this zone snapshot.

## Checkpoint 1: Add the zone to Cloudflare

- [ ] Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
- [ ] Select **Add a domain** or **Connect a domain**.
- [ ] Enter `pankajmouriya.com` without `https://` or `www`.
- [ ] Select the **Free** plan.
- [ ] Let Cloudflare scan for existing DNS records.
- [ ] Continue to the DNS record review screen.

Reference: [Cloudflare DNS setup](https://developers.cloudflare.com/dns/get-started/).

## Checkpoint 2: Prepare an empty Cloudflare application zone

The user accepted downtime and chose not to route Cloudflare DNS back to Netlify. The Cloudflare zone should therefore contain no apex, `www`, or `talks` website record before activation.

On Cloudflare's DNS record review screen:

1. Delete every imported A, AAAA, or CNAME record whose Name is `pankajmouriya.com` or `@`.
2. Delete every imported A, AAAA, or CNAME record whose Name is `www`.
3. Do not add a `talks` record.
4. Do not add a Pages or Workers record yet.
5. Confirm there are no website records in the Cloudflare table.
6. Select **Continue to activation**.

If the previously prepared Netlify CNAMEs are still visible, delete both:

```text
@     CNAME  apex-loadbalancer.netlify.com
www   CNAME  quizzical-swartz-5afd76.netlify.app
```

Cloudflare warns that a domain without matching DNS records will not be reachable. That outage is expected under the selected policy and begins as resolvers adopt the new Cloudflare nameservers.

Keep all three original `NETLIFY` records and both Netlify projects unchanged. They provide rollback options even though they are not copied into Cloudflare.

### Intentional hostname state during the outage

Until the new application is deployed and its custom domains are attached:

- `pankajmouriya.com` will not serve a website;
- `www.pankajmouriya.com` will not serve or redirect;
- `talks.pankajmouriya.com` is intentionally retired and will not resolve.

The future Cloudflare application setup will restore the apex and `www`. If `talks` later needs to redirect into the portfolio speaking section, add that hostname and a host-level redirect as a separate reviewed change.

## Checkpoint 3: Confirm DNSSEC is clear

No public DS record was found, so DNSSEC does not appear to be enabled. Confirm this in GoDaddy before the nameserver change:

- [ ] Open the [GoDaddy Domain Portfolio](https://dcc.godaddy.com/portfolio).
- [ ] Select `pankajmouriya.com`.
- [ ] Open **DNS**, then **DS Records** or **DNSSEC**.
- [ ] Confirm that there is no DS record.

If a DS record exists, remove it and wait until GoDaddy and public DNS no longer show it before continuing. A stale DS record can make the domain fail DNS validation after the nameserver change.

The reviewed GoDaddy screen shows **DNS** → **Nameservers**, the four expected `dns*.p06.nsone.net` values, and a separate **DS Records** tab. Use that DS Records tab for this check. The **Connect Domain** button is unrelated to this migration and should not be used.

## Checkpoint 4: Capture the assigned Cloudflare nameservers

In Cloudflare, open `pankajmouriya.com` and find **Cloudflare Nameservers** on the zone overview. Record the two exact assigned values here:

```text
Cloudflare nameserver 1: ______________________________
Cloudflare nameserver 2: ______________________________
```

They will resemble `name.ns.cloudflare.com`, but only the assigned values are valid. Before changing GoDaddy, confirm the Cloudflare DNS table contains no website records under the planned-downtime policy.

## Checkpoint 5: Replace nameservers at GoDaddy

Proceed only after Checkpoints 1 through 4 are complete.

- [ ] Open **GoDaddy Domain Portfolio**.
- [ ] Select `pankajmouriya.com`.
- [ ] Select **DNS**, then **Nameservers**. The screen should still show **Using custom nameservers** and the four `dns*.p06.nsone.net` values.
- [ ] Select **Change Nameservers**.
- [ ] Choose **I'll use my own nameservers** if GoDaddy asks which mode to use.
- [ ] Remove all four current `dns*.p06.nsone.net` nameservers.
- [ ] Enter the two exact Cloudflare nameservers.
- [ ] Confirm that only those two Cloudflare nameservers remain.
- [ ] Save and complete GoDaddy identity verification.

Do not select GoDaddy's **Connect Domain** action. Do not enter `apex-loadbalancer.netlify.com` or either `.netlify.app` hostname into the nameserver form. Under the selected downtime policy they should not remain in Cloudflare's DNS table either. The GoDaddy nameserver form receives only the two assigned `*.ns.cloudflare.com` hostnames.

This changes DNS authority only. Registration and renewal remain at GoDaddy.

Reference: [GoDaddy nameserver instructions](https://www.godaddy.com/en-uk/help/change-my-domain-nameservers-664).

## Checkpoint 6: Wait for Cloudflare activation

- [ ] Return to the Cloudflare zone overview.
- [ ] Select **Check nameservers now** if it is available.
- [ ] Wait until the zone status changes from **Pending Nameserver Update** to **Active**.
- [ ] Do not repeatedly change nameservers while propagation is in progress.

GoDaddy states that changes commonly appear within an hour but can take up to 48 hours globally.

Once Cloudflare shows **Active**, confirm the nameserver migration. The website outage is expected because the zone has no application records.

Useful read-only check:

```sh
dig +short NS pankajmouriya.com
```

Expected: the command returns only the two assigned Cloudflare nameservers. Do not troubleshoot the missing website until the new application has been deployed and attached.

## Checkpoint 7: Enable DNSSEC again

Do this only after Cloudflare shows the zone as **Active** and the assigned Cloudflare nameservers resolve publicly.

1. In Cloudflare, open **DNS** → **Settings** → **DNSSEC** and enable it.
2. Keep the Cloudflare DS values visible.
3. In GoDaddy, open `pankajmouriya.com` → **DNS** → **DS Records** → **Add**.
4. Copy the Cloudflare Key Tag, Algorithm, Digest Type, and Digest exactly.
5. Save, then wait for Cloudflare to report DNSSEC as active.

Do not invent or modify these values.

## Handoff to application deployment

DNS migration is complete when:

```text
Registrar: GoDaddy
Authoritative DNS: Cloudflare
Cloudflare zone: Active
DNSSEC: Active
Planned website outage: active until the Cloudflare application is attached
Legacy talks hostname: intentionally not migrated
Cloudflare Pages deployment: follow cloudflare-pages-deployment.md
```

Keep the old Netlify sites and DNS account recoverable until the new hosted preview, custom domain, TLS, redirects, and rollback checks pass.

## Reference from `tsd.report`

The sibling `tsd.report` project uses the same GoDaddy-to-Cloudflare DNS sequence. Its deployment is an Astro static build uploaded by GitHub Actions with Wrangler. The hosted project and pull-request preview were verified there, so its credential model is a useful reference:

- a restricted Cloudflare API token with Pages Read and Pages Write;
- `CLOUDFLARE_API_TOKEN` stored as a GitHub Actions secret;
- `CLOUDFLARE_ACCOUNT_ID` and the Pages project name stored as GitHub Actions variables;
- preview deployments before production activation;
- the domain attached only after the hosted output is verified.

Do not copy its deployment command yet. `tsd.report` produces a static `dist/` directory, while this repository currently uses a standard Next.js 16 build and does not configure `output: "export"`. Cloudflare Pages supports Next.js static exports written to `out/`; full Next.js applications use Cloudflare Workers. We will choose and verify the compatible path before creating the project or changing application DNS.

References:

- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Static Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

## Information safe to share during setup

Safe to share for review:

- the two assigned Cloudflare nameserver hostnames;
- DNS record types, names, targets, TTLs, proxy states, and priorities;
- Cloudflare zone status;
- Pages or Workers project name and public preview URL.

Never share:

- Cloudflare or GoDaddy passwords;
- API token values or Global API Keys;
- two-factor seeds, recovery codes, SMS codes, or email OTPs;
- domain transfer authorization codes;
- private keys.
