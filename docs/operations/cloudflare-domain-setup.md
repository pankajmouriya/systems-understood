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

## Checkpoint 2: Create the exact temporary Cloudflare records

The complete source zone has now been reviewed. On Cloudflare's DNS record review screen, configure exactly these temporary records:

| Type | Name | Target | Proxy status | TTL |
| --- | --- | --- | --- | --- |
| CNAME | `@` | `apex-loadbalancer.netlify.com` | DNS only | Auto |
| CNAME | `www` | `quizzical-swartz-5afd76.netlify.app` | DNS only | Auto |
| CNAME | `talks` | `jovial-kilby-174125.netlify.app` | DNS only | Auto |

Cloudflare accepts a CNAME at the apex and flattens it for DNS clients. Netlify documents `apex-loadbalancer.netlify.com` as the recommended external-DNS target when the provider supports ALIAS, ANAME, or CNAME flattening.

For each record:

1. Select **Add record**.
2. Choose **CNAME**.
3. Enter the Name and Target exactly as shown in the table.
4. Turn **Proxy status** off so the cloud is gray and reads **DNS only**.
5. Leave **TTL** at **Auto**.
6. Save.

Then reconcile anything Cloudflare imported automatically:

- [ ] Delete any imported A or AAAA record at `@` that conflicts with the apex CNAME.
- [ ] Delete any imported A, AAAA, or CNAME record at `www` that conflicts with the exact `www` CNAME above.
- [ ] Delete any imported A, AAAA, or CNAME record at `talks` that conflicts with the exact `talks` CNAME above.
- [ ] Do not create a record type named `NETLIFY`; Cloudflare does not use that provider-specific type.
- [ ] Do not copy `jolly-northcutt-b8f126.netlify.app`; its direct endpoint currently returns 404.
- [ ] Do not copy the observed `13.215.239.219` or `52.74.6.109` addresses; those were the resolved output of Netlify-managed routing, not the portable source configuration.
- [ ] Do not copy the old NS or SOA records.
- [ ] Do not add MX, TXT, CAA, or other service records unless another source proves they exist. The reviewed source zone contains only the three records above.
- [ ] Do not add a Pages or Workers record yet.

Keep the three original records unchanged in Netlify. They remain the rollback source until the Cloudflare zone and both existing sites have been verified.

### If Cloudflare reports that the host already exists

Cloudflare's initial scan may import resolved Netlify A records instead of the source `NETLIFY` records. Attempting to add the CNAME first then produces:

```text
An A, AAAA, or CNAME record with that host already exists.
```

The reviewed Cloudflare import contained these conflicting records:

| Type | Name | Imported value |
| --- | --- | --- |
| A | `@` / `pankajmouriya.com` | `13.52.188.95` |
| A | `@` / `pankajmouriya.com` | `52.52.192.191` |
| A | `www` | `98.84.224.111` |
| A | `www` | `18.208.88.157` |

These are another set of resolved Netlify edge addresses and should not become the portable Cloudflare configuration. While the Cloudflare zone is still pending and the Netlify nameservers remain authoritative:

1. Cancel the unsaved CNAME form.
2. Delete both imported A records whose Name is the apex domain.
3. Delete both imported A records whose Name is `www`.
4. Add and save the `@` CNAME from the exact table above.
5. Add and save the `www` CNAME from the exact table above.
6. Add and save the `talks` CNAME; the automatic scan did not discover it.
7. Confirm the table contains exactly the three DNS-only CNAME records before selecting **Continue to activation**.

Deleting records from this pending Cloudflare zone does not alter the live Netlify zone. Do not delete the source records in Netlify.

Reference: [Netlify external DNS configuration](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/).

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

They will resemble `name.ns.cloudflare.com`, but only the assigned values are valid. Before changing GoDaddy, review the imported Cloudflare DNS record list one more time.

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

Do not select GoDaddy's **Connect Domain** action. Do not enter `apex-loadbalancer.netlify.com` or either `.netlify.app` hostname into the nameserver form; those belong only in Cloudflare's DNS records table. The GoDaddy nameserver form receives only the two assigned `*.ns.cloudflare.com` hostnames.

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
https://talks.pankajmouriya.com/
```

Expected at this stage: the existing Netlify homepage still loads, `www` still redirects to the apex domain, and the independent talks site still loads. Do not continue to application deployment if any of these checks fail.

Useful read-only checks:

```sh
dig +short NS pankajmouriya.com
dig +short CNAME www.pankajmouriya.com
dig +short CNAME talks.pankajmouriya.com
curl -I https://pankajmouriya.com/
curl -I https://www.pankajmouriya.com/
curl -I https://talks.pankajmouriya.com/
```

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
Existing talks site: still reachable
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
