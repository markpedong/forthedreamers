#Supabase auth email templates

Raw HTML to paste into **Supabase Dashboard → Authentication → Emails → Templates**.
Each block = the full content of that box. Subjects go in the box below it.

Sample data for the preview:

| Variable | Value |
| --- | --- |
| `{{ .SiteURL }}` | `https://forthedreamers.com` |
| `{{ .ConfirmationURL }}` | `https://forthedreamers.com/auth/callback?next=/profile&code=abc123` |
| `{{ .Email }}` | `mark@example.com` |
| `{{ .NewEmail }}` | `new@example.com` |

---

## Authentication

| Supabase template | Subject | File |
| --- | --- | --- |
| Confirm sign up | `Confirm your email` | [confirm-signup.html](confirm-signup.html) |
| Invite user | `Confirm your email` | confirm-signup.html (or drop the welcome line) |
| Magic link or OTP | `Your sign-in link` | magic-link.html |
| Change email address | `Confirm your new email` | [confirm-email-change.html](confirm-email-change.html) |
| Reset password | `Reset your password` | [reset-password.html](reset-password.html) |
| Reauthentication | `Your verification code` | reauthentication.html |

## Security

| Supabase template | Subject | File |
| --- | --- | --- |
| Password changed | `Your password was changed` | [password-changed.html](password-changed.html) |
| Email address changed | `Your email address was changed` | [email-address-changed.html](email-address-changed.html) |

`{{ .Email }}` in **Email address changed** is the *new* address — Supabase sends that one to the
old address as the notice. Flip those two toggles on once the templates are saved.

---

## SMTP settings tab

Supabase sends these through the project SMTP. To route them via Resend:

| Field | Value |
| --- | --- |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | your Resend API key |
| Sender email | a verified domain address, e.g. `hello@forthedreamers.com` |
| Sender name | `For the Dreamers` |

## Reusable blocks

Brand bar (top of every email):

```html
<div style="padding:24px 28px;border-bottom:1px solid #e6e5e2">
  <a href="{{ .SiteURL }}" style="color:#26262a;font-size:15px;font-weight:600;letter-spacing:-0.01em;text-decoration:none">For the Dreamers</a>
</div>
```

Button: swap `href`, `label`, and the `url` on the button's `href`:

```html
<a href="{{ .ConfirmationURL }}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#26262a;color:#ffffff;font-size:14px;font-weight:500;border-radius:8px;text-decoration:none">Confirm email</a>
```

Brand tokens used (from `app/globals.css`, light theme, sRGB equivalents):

| Token | Value |
| --- | --- |
| Background | `#f5f4f2` |
| Card | `#ffffff` |
| Foreground | `#26262a` |
| Muted foreground | `#5c5c63` |
| Border | `#e6e5e2` |
| Primary | `#26262a` (neutral, near-black) |
| Primary foreground | `#ffffff` |
| Radius | `8px` |
| Font | Helvetica/Arial — Geist isn't installable in email clients |
