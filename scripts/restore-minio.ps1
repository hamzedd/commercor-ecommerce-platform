param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$TargetAlias,
  [Parameter(Mandatory=$true)][string]$TargetPrefix,
  [Parameter(Mandatory=$true)][string]$ConfirmPrefix
)
$ErrorActionPreference = 'Stop'
if ($TargetPrefix -cne $ConfirmPrefix) { throw 'ConfirmPrefix must exactly match TargetPrefix' }
if (-not (Test-Path -LiteralPath $Source)) { throw 'Backup source does not exist' }
if (-not (Get-Command mc -ErrorAction SilentlyContinue)) { throw 'MinIO Client (mc) is required on PATH' }
Get-ChildItem -LiteralPath $Source -Directory | ForEach-Object {
  $targetBucket = "$TargetPrefix-$($_.Name)"
  & mc mb --ignore-existing "$TargetAlias/$targetBucket"
  if ($LASTEXITCODE -ne 0) { throw "Could not create test bucket: $targetBucket" }
  & mc mirror $_.FullName "$TargetAlias/$targetBucket"
  if ($LASTEXITCODE -ne 0) { throw "Restore failed for test bucket: $targetBucket" }
}
