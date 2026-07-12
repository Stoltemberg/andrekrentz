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
