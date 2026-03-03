$HttpListener = New-Object System.Net.HttpListener
$HttpListener.Prefixes.Add("http://127.0.0.1:8000/")
$HttpListener.Start()

Write-Host "Server running at http://localhost:8000/" -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html"
    ".css" = "text/css"
    ".js" = "application/javascript"
    ".png" = "image/png"
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif" = "image/gif"
    ".svg" = "image/svg+xml"
    ".ico" = "image/x-icon"
    ".json" = "application/json"
}

while ($true) {
    $Context = $HttpListener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response
    $Path = $Request.Url.LocalPath
    
    if ($Path -eq "/") { $Path = "/index.html" }
    
    $FilePath = "." + $Path
    $FilePath = $FilePath -replace '/', '\'
    
    if (Test-Path $FilePath) {
        $ext = [System.IO.Path]::GetExtension($FilePath)
        $mime = $mimeTypes[$ext]
        if (-not $mime) { $mime = "application/octet-stream" }
        
        $Content = [System.IO.File]::ReadAllBytes($FilePath)
        $Response.ContentType = $mime
        $Response.ContentLength64 = $Content.Length
        $Response.OutputStream.Write($Content, 0, $Content.Length)
    } else {
        $Response.StatusCode = 404
    }
    
    $Response.Close()
}
