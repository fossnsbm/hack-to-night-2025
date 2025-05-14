# Hidden in Plain Sight Challenge

## Challenge Creation Instructions
1. Create a normal-looking JPEG image
2. Add metadata containing the flag to the image
3. The flag should be hidden in the EXIF data: `flag{m3t4d4t4_n3v3r_l13s}`
4. Optionally add a red herring like hidden text in the image that doesn't contain the flag

## Setup Instructions
1. Find a suitable image (nature/landscape works well) or create one
2. Add the flag to the EXIF data:
   ```
   exiftool -Comment="flag{m3t4d4t4_n3v3r_l13s}" image.jpg
   ```
3. Place the resulting image in the artifacts folder

## Expected Solution
Participants will:
1. Download the image
2. Examine the file using tools like `exiftool`, `strings`, or online EXIF viewers
3. Discover the flag in the metadata

## Hints (if needed)
- "Images often contain more information than what you can see."
- "Have you checked ALL the data contained in the file?"
- "Metadata can tell interesting stories about a file." 