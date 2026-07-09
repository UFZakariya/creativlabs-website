# PowerShell fallback static server for local preview when Node.js is not
# installed on this machine. Mirrors preview-server.mjs: serves this folder's
# static files and fakes a 200 OK for POSTs (the Netlify form simulation).
param(
  [int]$Port = $(if ($env:PORT) { [int]$env:PORT } else { 8767 })
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".mjs"  = "text/javascript; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".woff2"= "font/woff2"
  ".json" = "application/json; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Safetyline v2 preview (PowerShell fallback): http://127.0.0.1:$Port/"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    try {
      if ($req.HttpMethod -eq "POST") {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("ok")
        $res.ContentType = "text/plain"
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
        continue
      }

      $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
      if ($path -eq "/") { $path = "/index.html" }
      $full = Join-Path $root ($path.TrimStart("/"))
      $full = [System.IO.Path]::GetFullPath($full)

      if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        $res.StatusCode = 403
        $res.Close()
        continue
      }

      if (Test-Path $full -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
        $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $res.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } catch {
      try { $res.StatusCode = 500 } catch {}
    } finally {
      $res.Close()
    }
  }
} finally {
  $listener.Stop()
}
