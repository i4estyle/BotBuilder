param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $ProjectRoot 'src\assets\landing\logo.png'
$iconsPath = Join-Path $ProjectRoot 'public\icons'
$faviconPath = Join-Path $ProjectRoot 'public\favicon.ico'

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)
$mark = New-Object System.Drawing.Bitmap 194, 99, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

try {
  for ($y = 0; $y -lt $mark.Height; $y++) {
    for ($x = 0; $x -lt $mark.Width; $x++) {
      $pixel = $source.GetPixel($x, $y)

      # The full logo places a small green plus over the lower edge of BOT.
      # Restore that covered area to the original red block for the favicon.
      if ($x -ge 132 -and $x -le 158 -and $y -ge 84) {
        $pixel = [System.Drawing.Color]::FromArgb(255, 239, 29, 58)
      }

      $mark.SetPixel($x, $y, $pixel)
    }
  }

  function Write-IconPng {
    param(
      [int]$Size,
      [string]$OutputPath
    )

    $canvas = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)

    try {
      $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.Clear([System.Drawing.Color]::Transparent)

      $padding = [Math]::Max(1, [int][Math]::Round($Size * 0.06))
      $width = $Size - (2 * $padding)
      $height = [int][Math]::Round($width * ($mark.Height / $mark.Width))
      $top = [int][Math]::Floor(($Size - $height) / 2)
      $destination = New-Object System.Drawing.Rectangle $padding, $top, $width, $height
      $sourceRectangle = New-Object System.Drawing.Rectangle 0, 0, $mark.Width, $mark.Height

      $graphics.DrawImage(
        $mark,
        $destination,
        $sourceRectangle,
        [System.Drawing.GraphicsUnit]::Pixel
      )

      $canvas.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $graphics.Dispose()
      $canvas.Dispose()
    }
  }

  $pngTargets = @{
    16 = 'favicon-16x16.png'
    32 = 'favicon-32x32.png'
    48 = 'favicon-48x48.png'
    96 = 'favicon-96x96.png'
    128 = 'favicon-128x128.png'
    180 = 'apple-touch-icon.png'
    192 = 'icon-192x192.png'
    512 = 'icon-512x512.png'
  }

  foreach ($entry in $pngTargets.GetEnumerator()) {
    Write-IconPng -Size $entry.Key -OutputPath (Join-Path $iconsPath $entry.Value)
  }

  # ICO files may contain PNG-compressed frames. Keep one crisp 48px frame for browsers and crawlers.
  $png48 = [System.IO.File]::ReadAllBytes((Join-Path $iconsPath 'favicon-48x48.png'))
  $stream = New-Object System.IO.MemoryStream
  $writer = New-Object System.IO.BinaryWriter $stream

  try {
    $writer.Write([uint16]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]1)
    $writer.Write([byte]48)
    $writer.Write([byte]48)
    $writer.Write([byte]0)
    $writer.Write([byte]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]32)
    $writer.Write([uint32]$png48.Length)
    $writer.Write([uint32]22)
    $writer.Write($png48)
    [System.IO.File]::WriteAllBytes($faviconPath, $stream.ToArray())
  }
  finally {
    $writer.Dispose()
    $stream.Dispose()
  }
}
finally {
  $mark.Dispose()
  $source.Dispose()
}

Write-Output 'Generated transparent BotBuilder favicon assets.'
