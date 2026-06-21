// Inline-styled HTML email templates — most email clients strip <style>
// blocks, so everything here uses inline style attributes on purpose.
// Shares the navy header/contact-bar look already used for the
// case-opened confirmation email, so every email reads as one brand.

const SUPPORT_PHONE_DISPLAY = "+234 816 116 4007"
const SUPPORT_PHONE_TEL = "+2348161164007"
const SUPPORT_EMAIL = "info@busybrainstech-hub.com.ng"

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function emailShell(bodyHtml: string) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#EDEAE2;font-family:Inter,Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDEAE2;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#F7F5F0;max-width:600px;width:100%;">
            <tr>
              <td style="background:#081A33;padding:12px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#F7F5F0;">
                      <span style="margin-right:18px;white-space:nowrap;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7F5F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
                        <a href="tel:${SUPPORT_PHONE_TEL}" style="color:#F7F5F0;text-decoration:none;">${SUPPORT_PHONE_DISPLAY}</a>
                      </span>
                      <span style="white-space:nowrap;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7F5F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                        <a href="mailto:${SUPPORT_EMAIL}" style="color:#F7F5F0;text-decoration:none;">${SUPPORT_EMAIL}</a>
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;color:#0E2A4D;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function paragraphsHtml(message: string) {
  return escapeHtml(message)
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 16px;white-space:pre-line;">${para}</p>`)
    .join("")
}

export function caseResponseEmailHtml({
  fullName,
  referenceCode,
  subject,
  message,
}: {
  fullName: string
  referenceCode: string
  subject: string
  message: string
}) {
  const body = `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(fullName)},</p>
    <p style="margin:0 0 16px;">
      <strong>Case Reference ID:</strong> ${escapeHtml(referenceCode)}<br/>
      <strong>Re:</strong> ${escapeHtml(subject)}
    </p>
    ${paragraphsHtml(message)}
    <p style="margin:24px 0 0;">
      Best regards,<br/>
      <strong>BusyBrains Tech-Hub Corporate Services</strong><br/>
      We're here to help.
    </p>
  `
  return emailShell(body)
}
