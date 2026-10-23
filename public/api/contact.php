<?php
/**
 * North-Brook Ltd. - contact form endpoint for the static export on cPanel.
 * Mirrors app/api/contact/route.ts (which only runs in `next dev`).
 * Posts JSON: { name, company, email, phone, service, message, consent }
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const INBOX = 'info@northbrook.com.gh';
const FROM_ADDRESS = 'no-reply@northbrook.com.gh';
const MESSAGE_MIN_LENGTH = 20;
const RATE_LIMIT_HITS = 5;
const RATE_LIMIT_SECONDS = 600;

const SERVICE_LABELS = [
    'ship-agency' => 'Ship Agency & Husbandry',
    'freight' => 'Air & Sea Freight',
    'bunkering' => 'Bunkering',
    'warehousing' => 'Warehousing & Cargo Consolidation',
    'documentation' => 'Import & Export Documentation',
    'crew-management' => 'Crew Management',
    'customs' => 'Customs Clearance',
    'haulage' => 'Haulage Services',
    'marine-technical' => 'Marine Technical Services',
    'general' => 'General Inquiry',
];

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function text($value): string
{
    return trim(str_replace(["\r", "\n"], ' ', (string) $value));
}

function html($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function clientIp(): string
{
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

/**
 * Sliding-window throttle per IP so the endpoint cannot be used to relay mail.
 * Files live in the system temp dir with a project-scoped name; failure to
 * write is non-fatal - the message is simply allowed through.
 */
function throttle(): void
{
    $key = sha1(__DIR__ . '|' . clientIp());
    $file = rtrim(sys_get_temp_dir(), '/') . '/northbrook-mail-' . $key . '.json';

    $hits = [];
    if (is_readable($file)) {
        $raw = json_decode((string) file_get_contents($file), true);
        if (is_array($raw)) {
            $hits = $raw;
        }
    }

    $now = time();
    $hits = array_values(array_filter($hits, static function ($ts) use ($now) {
        return is_int($ts) && ($now - $ts) < RATE_LIMIT_SECONDS;
    }));

    if (count($hits) >= RATE_LIMIT_HITS) {
        respond(429, ['error' => 'Too many submissions from this address. Please try again shortly.']);
    }

    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
}

function buildPlain(array $d, string $serviceName): string
{
    return implode("\n", [
        '============================================================',
        'NORTH-BROOK LTD. - CLIENT INQUIRY BRIEF',
        '============================================================',
        'Date: ' . gmdate('c'),
        'Interest: ' . $serviceName,
        '',
        'CLIENT PROFILE:',
        '- Contact Name: ' . $d['name'],
        '- Company: ' . $d['company'],
        '- Email: ' . $d['email'],
        '- Phone: ' . ($d['phone'] !== '' ? $d['phone'] : 'N/A'),
        '',
        'BRIEF DETAILS:',
        $d['message'],
        '',
        '------------------------------------------------------------',
        'Consent: ' . ($d['consent'] ? 'Client agreed to the privacy policy data terms: YES' : 'NO'),
        '============================================================',
    ]);
}

function buildHtml(array $d, string $serviceName): string
{
    $name = html($d['name']);
    $company = html($d['company']);
    $email = html($d['email']);
    $phone = html($d['phone']);
    $message = nl2br(html($d['message']));
    $consent = $d['consent'] ? 'Approved' : 'Not Provided';
    $submittedOn = html(gmdate('F j, Y'));

    return '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>North-Brook Inquiry Brief</title>
  <style>
    body { font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #1a1615; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e3e3; border-top: 4px solid #E31E24; }
    .header { padding: 30px; background-color: #0D0D0D; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
    .content { padding: 40px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #E31E24; border-bottom: 1px solid #e8e3e3; padding-bottom: 10px; margin-bottom: 20px; margin-top: 30px; }
    .grid { width: 100%; border-collapse: collapse; }
    .grid td { padding: 8px 0; vertical-align: top; font-size: 14px; }
    .grid td.label { font-weight: bold; width: 140px; color: #4a4645; }
    .message-box { background-color: #f9f9f9; border-left: 3px solid #E31E24; padding: 20px; font-size: 14px; line-height: 1.6; color: #2d2a29; margin-top: 15px; }
    .footer { background-color: #f9f9f9; padding: 16px 40px; font-size: 11px; color: #7a7675; text-align: center; border-top: 1px solid #e8e3e3; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>North-Brook Ltd. Operations</h1></div>
    <div class="content">
      <div style="font-size: 18px; font-weight: 700; color: #0D0D0D; margin-bottom: 5px;">New Client Inquiry</div>
      <div style="font-size: 12px; color: #7a7675;">Submitted via the digital portal on ' . $submittedOn . '</div>
      <div class="section-title">Client Details</div>
      <table class="grid">
        <tr><td class="label">Contact Name:</td><td>' . $name . '</td></tr>
        <tr><td class="label">Company Name:</td><td><strong>' . $company . '</strong></td></tr>
        <tr><td class="label">Email Address:</td><td><a href="mailto:' . $email . '" style="color: #E31E24; text-decoration: none;">' . $email . '</a></td></tr>
        <tr><td class="label">Phone Number:</td><td>' . ($phone !== '' ? '<a href="tel:' . $phone . '" style="color: #1a1615; text-decoration: none;">' . $phone . '</a>' : 'N/A') . '</td></tr>
        <tr><td class="label">Service Focus:</td><td><span style="background-color: #E31E24; color: #ffffff; padding: 3px 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">' . html($serviceName) . '</span></td></tr>
      </table>
      <div class="section-title">Operations Brief</div>
      <div class="message-box">' . $message . '</div>
    </div>
    <div class="footer">
      This is an automated dispatch from the North-Brook Ltd website contact form.<br />
      Data storage consent: ' . $consent . '.
    </div>
  </div>
</body>
</html>';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Method not allowed.']);
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload)) {
    respond(400, ['error' => 'Malformed request body.']);
}

$data = [
    'name' => text($payload['name'] ?? ''),
    'company' => text($payload['company'] ?? ''),
    'email' => text($payload['email'] ?? ''),
    'phone' => text($payload['phone'] ?? ''),
    'service' => text($payload['service'] ?? ''),
    'message' => trim((string) ($payload['message'] ?? '')),
    'consent' => filter_var($payload['consent'] ?? false, FILTER_VALIDATE_BOOLEAN),
];

if ($data['name'] === '' || $data['company'] === '' || $data['service'] === '' || $data['message'] === '') {
    respond(400, ['error' => 'Missing required fields in the request body.']);
}
if (mb_strlen($data['name']) < 2) {
    respond(400, ['error' => 'A full name is required.']);
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    respond(400, ['error' => 'A valid email address is required.']);
}
if (mb_strlen($data['message']) < MESSAGE_MIN_LENGTH) {
    respond(400, ['error' => 'Message must be at least ' . MESSAGE_MIN_LENGTH . ' characters.']);
}
if (!$data['consent']) {
    respond(400, ['error' => 'Consent to the privacy policy is required.']);
}

$serviceName = SERVICE_LABELS[$data['service']] ?? $data['service'];

throttle();

$subject = '[Inquiry] New Client Brief from ' . $data['company'] . ' - ' . $serviceName;
$subject = str_replace(["\r", "\n"], '', $subject);
if (function_exists('mb_encode_mimeheader')) {
    $subject = mb_encode_mimeheader($subject, 'UTF-8', 'B');
}

$headers = implode("\r\n", [
    'From: North-Brook Portal <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $data['email'],
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
    'X-Auto-Response-Suppress: All',
]);

$sent = @mail(INBOX, $subject, buildHtml($data, $serviceName), $headers);

if (!$sent) {
    error_log('[northbrook contact] mail() failed for ' . $data['email'] . ' (' . $data['service'] . ')');
    respond(500, ['error' => 'Failed to compile or submit operations brief.']);
}

// Plain-text copy kept in the server log for the operations desk.
error_log('[northbrook contact] ' . buildPlain($data, $serviceName));

respond(200, ['success' => true, 'message' => 'Email sent successfully.']);
