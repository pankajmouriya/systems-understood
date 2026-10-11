# Cloudflare DNS setup for `pankajmouriya.com`

- **Updated:** 2026-10-11
- **Registrar:** GoDaddy
- **Current DNS and hosting:** NS1 / Netlify
- **Target authoritative DNS:** Cloudflare
- **Future application target:** Cloudflare, pending a verified Next.js deployment design

This runbook moves DNS authority to Cloudflare without transferring the domain registration away from GoDaddy. Complete each checkpoint in order. Do not remove the existing Netlify configuration until the replacement deployment has passed its hosted checks.

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

These public queries do not prove that the old DNS zone has no additional subdomain, verification, DKIM, or service records. Compare the complete old DNS record list before changing nameservers.

## Checkpoint 1: Add the zone to Cloudflare

- [ ] Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
- [ ] Select **Add a domain** or **Connect a domain**.
- [ ] Enter `pankajmouriya.com` without `https://` or `www`.
- [ ] Select the **Free** plan.
- [ ] Let Cloudflare scan for existing DNS records.
- [ ] Continue to the DNS record review screen.

Reference: [Cloudflare DNS setup](https://developers.cloudflare.com/dns/get-started/).

## Checkpoint 2: Reconcile every DNS record

Open the old domain/DNS configuration that currently backs the NS1 nameservers. This is likely the Netlify domain configuration. Export or capture the complete record list if the provider offers that option.

In the current Netlify interface, open the project/team switcher in the upper-left, choose **Projects**, select **DNS** in the team sidebar, and open `pankajmouriya.com`. The project-level **Domain management** page is useful evidence, but it does not show the complete DNS zone.

- [ ] Compare every old A, AAAA, CNAME, MX, TXT, SRV, CAA, and custom subdomain record with Cloudflare.
- [ ] Copy any missing record into Cloudflare with the exact name, value, priority, and TTL.
- [ ] Do not copy the old NS or SOA records.
- [ ] Keep existing web A and CNAME records **DNS only** during migration. Their cloud icon should be gray.
- [ ] Keep TTL on **Auto** unless the old record requires another value.
- [ ] Do not add a guessed Pages IP or Pages CNAME.

At minimum, the current apex and `www` behavior must be represented. Do not rely only on the two observed IP addresses if the old provider shows an alias or provider-managed record; reproduce the provider configuration Cloudflare supports.

## Checkpoint 3: Confirm DNSSEC is clear

No public DS record was found, so DNSSEC does not appear to be enabled. Confirm this in GoDaddy before the nameserver change:

- [ ] Open the [GoDaddy Domain Portfolio](https://dcc.godaddy.com/portfolio).
- [ ] Select `pankajmouriya.com`.
- [ ] Open **DNS**, then **DS Records** or **DNSSEC**.
- [ ] Confirm that there is no DS record.

If a DS record exists, remove it and wait until GoDaddy and public DNS no longer show it before continuing. A stale DS record can make the domain fail DNS validation after the nameserver change.

## Checkpoint 4: Capture the assigned Cloudflare nameservers

In Cloudflare, open `pankajmouriya.com` and find **Cloudflare Nameservers** on the zone overview. Record the two exact assigned values here:

```text
Cloudflare nameserver 1: ______________________________
Cloudflare nameserver 2: ______________________________
```

They will resemble `name.ns.cloudflare.com`, but only the assigned values are valid. Before changing GoDaddy, review the imported Cloudflare DNS record list one more time.

## Checkpoint 5: Replace nameservers at GoDaddy

Proceed only after Checkpoints 1 through 4 are complete.

- [ ] Open **GoDaddy Domain Portfolio**.
- [ ] Select `pankajmouriya.com`.
- [ ] Select **DNS**, then **Nameservers**.
- [ ] Choose **Change Nameservers** or **I'll use my own nameservers**.
- [ ] Remove all four current `dns*.p06.nsone.net` nameservers.
- [ ] Enter the two exact Cloudflare nameservers.
- [ ] Confirm that only those two Cloudflare nameservers remain.
- [ ] Save and complete GoDaddy identity verification.

This changes DNS authority only. Registration and renewal remain at GoDaddy.

Reference: [GoDaddy nameserver instructions](https://www.godaddy.com/en-uk/help/change-my-domain-nameservers-664).

## Checkpoint 6: Wait for Cloudflare activation

- [ ] Return to the Cloudflare zone overview.
- [ ] Select **Check nameservers now** if it is available.
- [ ] Wait until the zone status changes from **Pending Nameserver Update** to **Active**.
- [ ] Do not repeatedly change nameservers while propagation is in progress.

GoDaddy states that changes commonly appear within an hour but can take up to 48 hours globally.

Once Cloudflare shows **Active**, verify:

```text
https://pankajmouriya.com/
https://www.pankajmouriya.com/
```

Expected at this stage: the existing Netlify site still loads, and `www` still redirects to the apex domain.

## Checkpoint 7: Enable DNSSEC again

Do this only after Cloudflare shows the zone as **Active** and the existing site resolves correctly.

1. In Cloudflare, open **DNS** → **Settings** → **DNSSEC** and enable it.
2. Keep the Cloudflare DS values visible.
3. In GoDaddy, open `pankajmouriya.com` → **DNS** → **DS Records** → **Add**.
4. Copy the Cloudflare Key Tag, Algorithm, Digest Type, and Digest exactly.
5. Save, then wait for Cloudflare to report DNSSEC as active.

Do not invent or modify these values.

## Stop point before application deployment

DNS migration is complete when:

```text
Registrar: GoDaddy
Authoritative DNS: Cloudflare
Cloudflare zone: Active
DNSSEC: Active
Existing Netlify site: still reachable
Cloudflare Pages or Workers deployment: not connected yet
```

Keep the old Netlify site and DNS account recoverable until the new hosted preview, custom domain, TLS, redirects, and rollback checks pass.

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
