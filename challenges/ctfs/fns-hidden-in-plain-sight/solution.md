# Solution Guide: Hidden in Plain Sight Challenge

This document provides the solution method for the "Hidden in Plain Sight" challenge.

## Challenge Summary
An image file contains a hidden flag in its metadata that needs to be extracted.

## Solution Steps

### Method 1: Using `exiftool` (Recommended)
The most straightforward approach is to use ExifTool to examine all metadata in the image:

```bash
exiftool vacation.jpg
```

Look for the XPComment or UserComment fields in the output, which should contain the flag.

### Method 2: Using `strings` command
Another simple approach is to use the `strings` command to extract all readable text from the image:

```bash
strings vacation.jpg | grep flag
```

This should display: `flag{m3t4d4t4_n3v3r_l13s}`

### Method 3: Using an online EXIF viewer
For those without command line tools:
1. Visit an online EXIF viewer like https://exif.tools/ or http://exif-viewer.com/
2. Upload the image
3. Browse through all metadata fields to find the flag

### Method 4: Using Python with PIL/Pillow and piexif
```python
from PIL import Image
import piexif

exif_dict = piexif.load("vacation.jpg")
# Check XP Comment
xp_comment = exif_dict["0th"].get(piexif.ImageIFD.XPComment)
if xp_comment:
    print(xp_comment.decode('utf-16le'))

# Check User Comment
user_comment = exif_dict["Exif"].get(piexif.ExifIFD.UserComment)
if user_comment:
    print(user_comment)
```

## Expected Output
After examining the metadata, you should find:
```
flag{m3t4d4t4_n3v3r_l13s}
```

## Learning Objectives
This challenge teaches participants:
1. Understanding of metadata in files
2. Use of forensic tools to examine file properties
3. Awareness that files can contain hidden information beyond what's visible 