param(
  [Parameter(Mandatory=$true)][string]$Backup,
  [Parameter(Mandatory=$true)][string]$TargetDatabase,
  [Parameter(Mandatory=$true)][string]$ConfirmTarget,
  [string]$HostName = 'localhost',
  [int]$Port = 5432,
  [Parameter(Mandatory=$true)][string]$Username,
  [switch]$CreateTarget
)
$ErrorActionPreference = 'Stop'
if ($ConfirmTarget -cne $TargetDatabase) { throw 'ConfirmTarget must exactly match TargetDatabase' }
if (-not (Test-Path -LiteralPath $Backup)) { throw 'Backup file does not exist' }
foreach ($command in 'pg_restore','createdb') { if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "$command is required on PATH" } }
if (-not $env:PGPASSWORD) { throw 'Set PGPASSWORD in the process environment; it is never stored by this script' }
& pg_restore --list $Backup | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Backup validation failed' }
if ($CreateTarget) {
  & createdb --host $HostName --port $Port --username $Username --no-password $TargetDatabase
  if ($LASTEXITCODE -ne 0) { throw 'Target database creation failed; it may already exist' }
}
Write-Warning "Restoring into explicitly confirmed database '$TargetDatabase'. Existing objects may be changed."
& pg_restore --host $HostName --port $Port --username $Username --dbname $TargetDatabase --no-password --exit-on-error --no-owner --no-privileges $Backup
if ($LASTEXITCODE -ne 0) { throw "pg_restore failed with exit code $LASTEXITCODE" }
Write-Output "Restore completed: $TargetDatabase"
