# Repository context for security review

Next.js 13.2.1 **Pages Router** documentation site. Deployed as a Docker image on AWS Lambda behind
API Gateway and a single CloudFront distribution. ~30 first-party `.ts`/`.tsx` files; everything else
is dependencies.

## Where code actually runs — read this before reporting anything

Most findings in this repo are wrong because they assume request-time execution. Almost nothing is.

- **Request-time (server), the entire surface:** exactly two pages —
  `pages/fusionfeed/graphql/explorer-and-reference.tsx` and `pages/fusionfeed/rest/explorer-and-reference.tsx`.
  Both wrap `getServerSideProps` in `withAuth` (`lib/auth.ts`).
- **Everything else is `getStaticProps` with `fallback: false`** (`pages/[...path].tsx:45`). Next 404s
  any path not returned by `getStaticPaths`, without invoking `getStaticProps`. Request values never
  reach those code paths.
- **Build-time input is `fs.readFile('./content')` only.** `next build` makes no network calls. The
  MDX compiler's only input is the committed tree, so "attacker-controlled MDX" is not a threat —
  whoever controls a commit already controls the site.
- **Browser:** `components/` runs on visitors' machines. `DefaultPage` evaluates
  `__NEXT_DATA__.compiledSource` through `new Function`; that content is a build-time artifact.

A defect that only fires at build time, or only with committer-controlled input, is a code-quality
note here. Say which of the three contexts your finding lives in.

## Credential handling — the highest-value area

The `fftoken` cookie holds the user's **live FusionFeed API key**, not a session token.

- `components/LoginPage/LoginForm.tsx:30` sets it via `js-cookie` (client-side, so never `HttpOnly`,
  and the options object passes only `expires`).
- `lib/auth.ts:11-19` reads it server-side and forwards it as an `Authorization` header to FusionFeed
  purely to test validity, exposing the result as redirect-vs-render.
- `components/RESTExplorerPage/index.tsx:19-32` re-parses `document.cookie` by hand
  (`.split('=')[1]` truncates at the first `=`), `:58-63` copies the credential into
  `localStorage['TryIt_securitySchemeValues']`, and `:36-44,80-101` runs a `MutationObserver`
  redactor over `wrapperRef` only — `characterData` and `childList`, never `attributes`.
- `components/GraphQLExplorerPage/index.tsx:55-68` passes it to `createGraphiQLFetcher` headers and
  `wsConnectionParams`. `:36-51` reads `location.hash`, extracts `query`, loads it into the editor,
  then erases the fragment via `pushState`.

Anything that moves this credential to a new surface — an attribute, a clipboard, a storage key, a
log, a URL — is worth reporting even without an execution primitive.

## Verified closed — do not re-report without a new mechanism

Each of these was measured, not assumed:

- Path traversal via `canonicalContentPath` (`lib/content.ts:39`). The invariant *is* breakable —
  `/a/../../etc/passwd` returns `"etc/passwd"` with no leading slash — but every consumer is fed
  from `walk('./content')` filenames or from `getStaticPaths`. Build-time only.
- Prototype pollution: no pollution source exists in the deployed client bundles.
- `$ref` / SSRF via the OpenAPI spec: the spec is served by FusionFeed and fetched with the user's
  own credential. An attacker does not control it.
- Open redirect on `/login`: `getDestination` survives a 17-payload matrix; Next's `parseRelativeUrl`
  blocks the rest.
- CI/CD: every workflow is `on: push` only; no `${{ }}` expression reaches a shell; the OIDC trust
  policy uses `StringEquals` on an exact branch ref.
- Cache poisoning: the CloudFront cache policy sets only `cookieBehavior`, so no `OriginRequestPolicy`
  exists and the query string is stripped before the origin.

## Findings that are not useful here

- **Dependency CVEs without a demonstrated path in this app.** `npm audit` reports 70, four critical,
  all transitive — and the request-time server closure contains no lockfile packages at all, only
  `next@13.2.1` and its vendored `dist/compiled/*`. Version ranges alone are noise.
- **Availability, DoS, resource exhaustion.**
- **Anything requiring a merged pull request.** No external-head PR has ever been merged.

## Calibration

Generic rulesets find nothing here — a full Semgrep run across the JavaScript, TypeScript, React and
Node rulesets returned **zero** results. The real defects in this codebase are semantic, and they look
like this:

- A credential redactor that misses attributes and the clipboard, so the UI displays a placeholder
  while the Copy button hands over the live key.
- `components/LoginPage/LoginAgreement.tsx:16` removes a cookie named `ffcookie` — a string that
  appears exactly once in the entire repository and is never set anywhere. Declining the license
  agreement therefore leaves the user fully authenticated.
- Two sibling components parsing the same cookie two different ways, so a token containing `=` works
  in one explorer and 401s in the other.

Reason about intent and about what a control is *supposed* to guarantee. Pattern matching has already
been done and found nothing.
