// Small markdown helper for club posts.
// Supports the handful of bits people actually type on a wall.
//
// SECURITY: post bodies are user-controlled and are rendered as HTML by
// PostBody (dangerouslySetInnerHTML). Everything is HTML-escaped FIRST, so the
// only tags in the output are the ones generated below. Link targets are
// restricted to a safe allowlist of schemes.

function escapeHtml(src) {
  return src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Allow http(s), mailto, same-site paths ("/mod"), and fragments ("#top").
// Rejects javascript:, data:, vbscript:, protocol-relative "//host", etc.
function isSafeUrl(url) {
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url.trim());
}

function renderMarkdown(src) {
  const text = String(src ?? "");

  return escapeHtml(text)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) =>
      isSafeUrl(url)
        ? `<a href="${url.trim()}" rel="noopener noreferrer">${label}</a>`
        : match
    )
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

module.exports = { renderMarkdown };
