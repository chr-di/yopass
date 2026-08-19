# Studio Vybe branding without a business license

- **Problem:** brand the `14.8.0` credential-sharing UI and explain its browser-side encryption without changing the licensed branding gate or crypto flow.
- **Decision:** keep `License.CurrentlyValid()` untouched and change only compiled source defaults, the bundled logo, local CSS/font assets, fallback strings, and an independent `trust.*` component above the create form.
- **Why:** unlicensed `/config` already returns compiled default theme names, so a bundled `studiovybe` DaisyUI theme reaches the intended UI without bypassing the paywall.
- **Gotchas:** both logical themes must resolve to the same light theme; first-paint and config-error fallbacks must match; Outfit Regular must override weight/family utilities while case-sensitive inputs, keys, links, and revealed secrets keep their original case; verify the full textarea remains above the fold at 375 x 667.
