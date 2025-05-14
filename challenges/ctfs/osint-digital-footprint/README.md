# Digital Footprint

## Challenge Setup

1. Create an image with embedded EXIF metadata containing:
   - GPS coordinates pointing to your company's address
   - Camera model/make information
   - Author/copyright information with the name "Alex Johnson"
   - Creation date that matches a notable security incident
   - Software information showing it was edited in Photoshop

2. The image should contain a subtle visual clue pointing to a specific building or location within the company premises.

3. Create a website mockup with a security vulnerability mentioned in a comment in the source code.

## Solution Guide

1. Download and analyze the image using EXIF metadata tools (exiftool, online EXIF viewers)
2. Extract the GPS coordinates to identify the company location
3. Note the author name (Alex Johnson) from the metadata
4. Identify the camera model information needed for the flag
5. Find the creation date and correlate it with known security incidents
6. Look for hidden comments in the image metadata that might contain hints
7. Form the complete flag: flag{m3t4d4t4_n3v3r_l13s_c4m3r4_m0d3l_GP5}

## Deployment Notes

- Create the image with appropriate metadata using exiftool
- Host the image on the challenge server
- Provide a simple web interface for downloading the image
- Ensure the metadata remains intact during deployment 