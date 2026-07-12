$ErrorActionPreference = 'Stop'

$html = Get-Content -Raw -Encoding utf8 "$PSScriptRoot/../index.html"
$js = Get-Content -Raw -Encoding utf8 "$PSScriptRoot/../main.js"
$css = Get-Content -Raw -Encoding utf8 "$PSScriptRoot/../style.css"

@(
  'https://andrekrentzadvogado.com.br/',
  'tel:+5551999422266',
  'rel="canonical"',
  'property="og:title"',
  'data-lead-channel="whatsapp"',
  'data-lead-channel="phone"',
  'data-lead-channel="map"'
  'Conversar sobre meu caso',
  'class="hero__proof"',
  'class="practice-index"',
  'class="authority-band"'
) | ForEach-Object {
  if ($html -notmatch [regex]::Escape($_)) { throw "Missing: $_" }
}

if ($html -match '>Fale Conosco<') {
  throw 'Generic primary CTA remains'
}

if ($html -match 'https://andrekrentz\.com\.br/') { throw 'Outdated canonical remains' }
if ($js -notmatch "CustomEvent\('lead:cta'") { throw 'CTA event missing' }
if ([regex]::Matches($html, '<main(?:\s|>)').Count -ne 1 -or [regex]::Matches($html, '</main>').Count -ne 1) { throw 'Expected exactly one main landmark' }
$main = [regex]::Match($html, '(?s)<main(?:\s[^>]*)?>(.*?)</main>')
if (-not $main.Success -or $main.Groups[1].Value -notmatch 'class="hero' -or $main.Groups[1].Value -notmatch '<h1') { throw 'Main must contain the hero and primary heading' }
if ($html -notmatch '<h1[^>]*>Andr' + [char]0x00e9 + ' Krentz Advocacia</h1>') { throw 'Hero H1 must foreground Andre Krentz Advocacia' }
if ($html -notmatch '(?s)</main>\s*<footer') { throw 'Main must close immediately before the footer' }
if ($js -notmatch 'channel: .whatsapp.') { throw 'Form telemetry missing' }

@(
  'IntersectionObserver',
  '.footer',
  '.whatsapp-float',
  'whatsapp-float--hidden'
) | ForEach-Object {
  if ($js -notmatch [regex]::Escape($_)) { throw "Floating CTA guard missing: $_" }
}

@(
  '.whatsapp-float--hidden',
  'opacity: 0',
  'visibility: hidden',
  'pointer-events: none',
  'transform: translateY(16px)'
) | ForEach-Object {
  if ($css -notmatch [regex]::Escape($_)) { throw "Floating CTA hidden state missing: $_" }
}
