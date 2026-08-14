param(
  [Parameter(Mandatory=$true)][string]$Alias,
  [Parameter(Mandatory=$true)][string]$Destination,
  [string[]]$Buckets = @('commercor','products','categories','brands','invoices')
)
$ErrorActionPreference = 'Stop'
if (-not (Get-Command mc -ErrorAction SilentlyContinue)) { throw 'MinIO Client (mc) is required on PATH' }
$root = Join-Path ([IO.Path]::GetFullPath($Destination)) ((Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ'))
[IO.Directory]::CreateDirectory($root) | Out-Null
foreach ($bucket in $Buckets) {
  & mc stat "$Alias/$bucket" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Bucket is unavailable: $bucket" }
  & mc mirror "$Alias/$bucket" (Join-Path $root $bucket)
  if ($LASTEXITCODE -ne 0) { throw "Backup failed for bucket: $bucket" }
}
Write-Output $root
