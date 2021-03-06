[string]$sourceDirectory  = Resolve-Path -Path "client\dist\"
[string]$destination = Resolve-Path -Path "server\public\"
[string]$destinationDirectory = $destination+"dist\"

Write-Host $sourceDirectory
Write-Host $destinationDirectory

npm run build --prefix client

if ( Test-Path -Path $destinationDirectory -PathType Container ) {
  Remove-Item $destinationDirectory -Recurse
}
Copy-item -Path $sourceDirectory -Destination $destination  -Recurse -Verbose
