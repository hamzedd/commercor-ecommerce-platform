param(
  [Parameter(Mandatory=$true)][string]$Database,
  [Parameter(Mandatory=$true)][string]$Destination,
  [string]$HostName = 'localhost',
  [int]$Port = 5432,
  [Parameter(Mandatory=$true)][string]$Username
)
$ErrorActionPreference = 'Stop'
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) { throw 'pg_dump is required on PATH' }
if (-not $env:PGPASSWORD) { throw 'Set PGPASSWORD in the process environment; it is never stored by this script' }
$destinationPath = [IO.Path]::GetFullPath($Destination)
[IO.Directory]::CreateDirectory($destinationPath) | Out-Null
$stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$safeDatabase = $Database -replace '[^A-Za-z0-9_.-]', '_'
$output = Join-Path $destinationPath "$safeDatabase-$stamp.dump"
& pg_dump --host $HostName --port $Port --username $Username --dbname $Database --format custom --file $output --no-password
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed with exit code $LASTEXITCODE" }
& pg_restore --list $output | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Backup validation failed' }
Write-Output $output
