import { SendMailClient } from "zeptomail";

const ZEPTO_URL = "https://api.zeptomail.com/v1.1/email";

let client: SendMailClient | null = null;

function getClient(): SendMailClient | null {
  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) return null;
  if (!client) {
    client = new SendMailClient({ url: ZEPTO_URL, token });
  }
  return client;
}

interface LeadEmailData {
  referenceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  quoteAmount?: string | null;
  servicePin?: string | null;
  serviceCity?: string | null;
  serviceAddress?: string | null;
  appointmentDate?: string | null;
  appointmentTime?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  const mailClient = getClient();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!mailClient || !adminEmail) return;

  const subject = `New Lead: ${lead.customerName} — ${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`;

  await mailClient.sendMail({
    from: { address: "noreply@quickfixwindshields.co", name: "QuickFix Windshields" },
    to: [{ email_address: { address: adminEmail, name: "Admin" } }],
    subject,
    htmlbody: buildHtml(lead),
  });
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:8px 12px;color:#111827">${value}</td></tr>`;
}

function section(title: string, rows: string): string {
  if (!rows.trim()) return "";
  return `
    <tr><td colspan="2" style="padding:16px 12px 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;border-bottom:1px solid #e5e7eb">${title}</td></tr>
    ${rows}`;
}

function formatINR(amount: string): string {
  return `\u20B9${Number(amount).toLocaleString("en-IN")}`;
}

function buildHtml(lead: LeadEmailData): string {
  const customerRows = [
    row("Name", lead.customerName),
    row("Phone", lead.customerPhone),
    row("Email", lead.customerEmail || "Not provided"),
  ].join("");

  const vehicleRows = [
    row("Vehicle", `${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`),
    row("Quote", lead.quoteAmount ? formatINR(lead.quoteAmount) : "N/A"),
  ].join("");

  const locationRows = [
    row("PIN Code", lead.servicePin),
    row("City", lead.serviceCity),
    row("Address", lead.serviceAddress),
  ].join("");

  const appointmentRows = [
    row("Date", lead.appointmentDate),
    row("Time", lead.appointmentTime),
  ].join("");

  const attributionRows = [
    row("Source", lead.utmSource),
    row("Medium", lead.utmMedium),
    row("Campaign", lead.utmCampaign),
  ].join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:#000000;padding:20px 24px">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:600">QuickFix Windshields — New Lead</h1>
    </div>
    <div style="padding:20px 12px">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px 16px;margin-bottom:16px">
        <span style="font-size:13px;color:#166534">Reference ID: <strong>${lead.referenceId}</strong></span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">
        ${section("Customer", customerRows)}
        ${section("Vehicle", vehicleRows)}
        ${section("Service Location", locationRows)}
        ${section("Appointment", appointmentRows)}
        ${section("Attribution", attributionRows)}
      </table>
    </div>
    <div style="padding:16px 24px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af">
      This is an automated notification from QuickFix Windshields.
    </div>
  </div>
</body>
</html>`;
}
