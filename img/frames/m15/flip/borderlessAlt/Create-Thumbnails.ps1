Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# List of folder names that require special processing (crop to content first)
$script:SpecialFolders = @("crowns", "pt", "stamp")

function Select-Folder {
    # Get the directory where the script is located
    $scriptPath = $PSScriptRoot
    if (-not $scriptPath) {
        $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    }
    
    # Create OpenFileDialog configured as folder picker
    $folderDialog = New-Object System.Windows.Forms.OpenFileDialog
    $folderDialog.ValidateNames = $false
    $folderDialog.CheckFileExists = $false
    $folderDialog.CheckPathExists = $true
    $folderDialog.FileName = "Select Folder"
    $folderDialog.Title = "Select folder containing images"
    $folderDialog.InitialDirectory = $scriptPath
    
    # Configure to show folders
    $folderDialog.Filter = "Folders|*.folder"
    $folderDialog.FilterIndex = 1
    $folderDialog.RestoreDirectory = $true
    $folderDialog.ReadOnlyChecked = $true
    $folderDialog.ShowReadOnly = $false
    
    if ($folderDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        return Split-Path -Parent $folderDialog.FileName
    }
    return $null
}

function Get-ContentBounds {
    param(
        [System.Drawing.Bitmap]$Image
    )
    
    $width = $Image.Width
    $height = $Image.Height
    
    # Scan from edges inward to find content bounds
    # Find left edge
    $left = $width
    for ($x = 0; $x -lt $width; $x++) {
        $found = $false
        for ($y = 0; $y -lt $height; $y++) {
            $pixel = $Image.GetPixel($x, $y)
            if ($pixel.A -gt 10 -and ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250)) {
                $left = $x
                $found = $true
                break
            }
        }
        if ($found) { break }
    }
    
    # Find right edge
    $right = 0
    for ($x = $width - 1; $x -ge $left; $x--) {
        $found = $false
        for ($y = 0; $y -lt $height; $y++) {
            $pixel = $Image.GetPixel($x, $y)
            if ($pixel.A -gt 10 -and ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250)) {
                $right = $x
                $found = $true
                break
            }
        }
        if ($found) { break }
    }
    
    # Find top edge
    $top = $height
    for ($y = 0; $y -lt $height; $y++) {
        $found = $false
        for ($x = $left; $x -le $right; $x++) {
            $pixel = $Image.GetPixel($x, $y)
            if ($pixel.A -gt 10 -and ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250)) {
                $top = $y
                $found = $true
                break
            }
        }
        if ($found) { break }
    }
    
    # Find bottom edge
    $bottom = 0
    for ($y = $height - 1; $y -ge $top; $y--) {
        $found = $false
        for ($x = $left; $x -le $right; $x++) {
            $pixel = $Image.GetPixel($x, $y)
            if ($pixel.A -gt 10 -and ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250)) {
                $bottom = $y
                $found = $true
                break
            }
        }
        if ($found) { break }
    }
    
    # If no content found, return full image bounds
    if ($right -lt $left -or $bottom -lt $top) {
        return @{
            X = 0
            Y = 0
            Width = $width
            Height = $height
        }
    }
    
    # Add small padding (2 pixels)
    $padding = 2
    $left = [Math]::Max(0, $left - $padding)
    $top = [Math]::Max(0, $top - $padding)
    $right = [Math]::Min($width - 1, $right + $padding)
    $bottom = [Math]::Min($height - 1, $bottom + $padding)
    
    return @{
        X = $left
        Y = $top
        Width = $right - $left + 1
        Height = $bottom - $top + 1
    }
}

function Crop-ToContent {
    param(
        [System.Drawing.Image]$Image
    )
    
    try {
        # Convert to bitmap for pixel-level access
        $bitmap = New-Object System.Drawing.Bitmap($Image)
        
        # Get content bounds
        $bounds = Get-ContentBounds -Image $bitmap
        
        # Create cropped image
        $croppedImage = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
        $graphics = [System.Drawing.Graphics]::FromImage($croppedImage)
        
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        $sourceRect = New-Object System.Drawing.Rectangle($bounds.X, $bounds.Y, $bounds.Width, $bounds.Height)
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $bounds.Width, $bounds.Height)
        
        $graphics.DrawImage($bitmap, $destRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
        
        $graphics.Dispose()
        $bitmap.Dispose()
        
        return $croppedImage
    }
    catch {
        Write-Host "Error cropping image: $($_.Exception.Message)" -ForegroundColor Red
        if ($graphics) { $graphics.Dispose() }
        if ($bitmap) { $bitmap.Dispose() }
        return $Image
    }
}

function Test-IsSpecialFolder {
    param(
        [string]$ImagePath
    )
    
    $parentFolder = Split-Path -Leaf (Split-Path -Parent $ImagePath)
    return $script:SpecialFolders -contains $parentFolder.ToLower()
}

function Create-Thumbnail {
    param(
        [string]$ImagePath,
        [int]$MaxDimension = 120
    )
    
    try {
        # Check if this is in a special folder
        $isSpecialFolder = Test-IsSpecialFolder -ImagePath $ImagePath
        
        if ($isSpecialFolder) {
            Write-Host "Special processing for: $([System.IO.Path]::GetFileName($ImagePath))" -ForegroundColor Cyan
        }
        
        # Load the image
        $originalImage = [System.Drawing.Image]::FromFile($ImagePath)
        
        # For special folders, crop to content first
        if ($isSpecialFolder) {
            $processedImage = Crop-ToContent -Image $originalImage
            $originalImage.Dispose()
            $originalImage = $processedImage
        }
        
        # Calculate new dimensions
        $originalWidth = $originalImage.Width
        $originalHeight = $originalImage.Height
        $maxCurrent = [Math]::Max($originalWidth, $originalHeight)
        
        if ($maxCurrent -le $MaxDimension) {
            $newWidth = $originalWidth
            $newHeight = $originalHeight
        } else {
            $scaleFactor = $MaxDimension / $maxCurrent
            $newWidth = [int]($originalWidth * $scaleFactor)
            $newHeight = [int]($originalHeight * $scaleFactor)
        }
        
        # Create new bitmap with white background
        $thumbnail = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($thumbnail)
        
        # Set white background
        $graphics.Clear([System.Drawing.Color]::White)
        
        # Set high quality rendering
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        # Draw the resized image
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $newWidth, $newHeight)
        $graphics.DrawImage($originalImage, $destRect)
        
        # Create output filename
        $directory = [System.IO.Path]::GetDirectoryName($ImagePath)
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($ImagePath)
        $extension = [System.IO.Path]::GetExtension($ImagePath)
        $outputPath = Join-Path $directory "$fileName`Thumb$extension"
        
        # Save the thumbnail
        $thumbnail.Save($outputPath, $originalImage.RawFormat)
        
        Write-Host "Created thumbnail: $([System.IO.Path]::GetFileName($outputPath))"
        
        # Clean up
        $graphics.Dispose()
        $thumbnail.Dispose()
        $originalImage.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error processing $ImagePath`: $($_.Exception.Message)" -ForegroundColor Red
        
        # Clean up on error
        if ($graphics) { $graphics.Dispose() }
        if ($thumbnail) { $thumbnail.Dispose() }
        if ($originalImage) { $originalImage.Dispose() }
        
        return $false
    }
}

function Main {
    Write-Host "Image Thumbnail Generator (PowerShell)" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "Starting from script directory: $PSScriptRoot" -ForegroundColor Cyan
    
    # Start timing
    $startTime = Get-Date
    
    # Select folder
    $folderPath = Select-Folder
    if (-not $folderPath) {
        Write-Host "No folder selected. Exiting." -ForegroundColor Yellow
        return
    }
    
    Write-Host "Selected folder: $folderPath"
    
    # Get all image files recursively
    $imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif", "*.tiff", "*.tif")
    $imageFiles = @()
    
    foreach ($extension in $imageExtensions) {
        $imageFiles += Get-ChildItem -Path $folderPath -Filter $extension -Recurse -File
    }
    
    if ($imageFiles.Count -eq 0) {
        Write-Host "No image files found in the selected folder and its subfolders." -ForegroundColor Yellow
        return
    }
    
    Write-Host "Found $($imageFiles.Count) image(s) to process..."
    Write-Host "Sorting images into processing queues..." -ForegroundColor Cyan
    
    # Separate images into two queues
    $regularQueue = @()
    $specialQueue = @()
    
    foreach ($imageFile in $imageFiles) {
        # Skip files that already have 'Thumb' in the name
        if ($imageFile.BaseName -notlike "*Thumb") {
            if (Test-IsSpecialFolder -ImagePath $imageFile.FullName) {
                $specialQueue += $imageFile
            } else {
                $regularQueue += $imageFile
            }
        }
    }
    
    Write-Host "  Regular processing: $($regularQueue.Count) image(s)" -ForegroundColor White
    Write-Host "  Special processing (crop to content): $($specialQueue.Count) image(s)" -ForegroundColor Cyan
    
    $processedCount = 0
    
    # Process regular images first (faster)
    if ($regularQueue.Count -gt 0) {
        Write-Host "`nProcessing regular images..." -ForegroundColor Green
        foreach ($imageFile in $regularQueue) {
            # Check if thumbnail already exists
            $directory = [System.IO.Path]::GetDirectoryName($imageFile.FullName)
            $fileName = [System.IO.Path]::GetFileNameWithoutExtension($imageFile.FullName)
            $extension = [System.IO.Path]::GetExtension($imageFile.FullName)
            $thumbnailPath = Join-Path $directory "$fileName`Thumb$extension"
            
            if (Test-Path $thumbnailPath) {
                Write-Host "Skipping existing thumbnail: $($imageFile.Name)" -ForegroundColor Gray
            } else {
                if (Create-Thumbnail -ImagePath $imageFile.FullName) {
                    $processedCount++
                }
            }
        }
    }
    
    # Process special images second (slower - crop to content)
    if ($specialQueue.Count -gt 0) {
        Write-Host "`nProcessing special folder images (crop to content)..." -ForegroundColor Green
        foreach ($imageFile in $specialQueue) {
            # Check if thumbnail already exists
            $directory = [System.IO.Path]::GetDirectoryName($imageFile.FullName)
            $fileName = [System.IO.Path]::GetFileNameWithoutExtension($imageFile.FullName)
            $extension = [System.IO.Path]::GetExtension($imageFile.FullName)
            $thumbnailPath = Join-Path $directory "$fileName`Thumb$extension"
            
            if (Test-Path $thumbnailPath) {
                Write-Host "Skipping existing thumbnail: $($imageFile.Name)" -ForegroundColor Gray
            } else {
                if (Create-Thumbnail -ImagePath $imageFile.FullName) {
                    $processedCount++
                }
            }
        }
    }
    
    # Calculate and display total time
    $endTime = Get-Date
    $totalTime = $endTime - $startTime
    
    # Format time message
    $timeMessage = "Completed in "
    if ($totalTime.TotalMinutes -ge 1) {
        $minutes = [Math]::Floor($totalTime.TotalMinutes)
        if ($minutes -eq 1) {
            $timeMessage += "1 minute "
        } else {
            $timeMessage += "$minutes minutes "
        }
    }
    $seconds = [Math]::Floor($totalTime.Seconds + ($totalTime.Milliseconds / 1000))
    $timeMessage += "$seconds seconds"
    
    Write-Host "`n$timeMessage" -ForegroundColor Green
    Write-Host "Processed $processedCount images." -ForegroundColor Green
    Write-Host "Thumbnails saved with 'Thumb' suffix in their respective folders." -ForegroundColor Green
    
    # Keep window open
    Write-Host "`nPress any key to exit..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Run the main function
Main