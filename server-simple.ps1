$port = 8000
$folder = (Get-Location).Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Portfolio Server Running at http://localhost:$port" -ForegroundColor Green
Write-Host "Your website is LIVE!" -ForegroundColor Cyan

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.LocalPath
    
    if ($path -eq '/') { $path = '/index.html' }
    
    $filePath = Join-Path $folder $path.TrimStart('/')
    
    if (Test-Path $filePath -PathType Leaf) {
      $content = [IO.File]::ReadAllBytes($filePath)
      $ext = [IO.Path]::GetExtension($filePath)
      
      $mimeTypes = @{
        '.html' = 'text/html'
        '.css' = 'text/css'
        '.js' = 'application/javascript'
        '.json' = 'application/json'
        '.png' = 'image/png'
        '.jpg' = 'image/jpeg'
        '.gif' = 'image/gif'
        '.svg' = 'image/svg+xml'
        '.woff' = 'font/woff'
        '.woff2' = 'font/woff2'
      }
      
      $response.ContentType = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }
      $response.OutputStream.Write($content, 0, $content.Length)
    } else {
      $response.StatusCode = 404
    }
  } catch {
    # Silently handle errors
  } finally {
    $response.OutputStream.Close()
  }
}

$listener.Stop()
