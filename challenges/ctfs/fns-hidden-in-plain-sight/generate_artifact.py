#!/usr/bin/env python3
"""
Script to generate the artifact for the 'Hidden in Plain Sight' challenge.
This script will download a sample image and embed the flag in its EXIF data.
"""

import os
import sys
import urllib.request
from PIL import Image
import piexif

# Ensure the artifacts directory exists
artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
os.makedirs(artifacts_dir, exist_ok=True)

# Flag to embed in the image
FLAG = "flag{m3t4d4t4_n3v3r_l13s}"

# Target image path
target_image = os.path.join(artifacts_dir, "vacation.jpg")

# If we need to download a sample image (in case one isn't provided)
sample_image_url = "https://source.unsplash.com/random/1600x900/?nature,vacation"

def download_sample_image():
    """Download a sample image from Unsplash."""
    try:
        print(f"Downloading sample image from {sample_image_url}...")
        urllib.request.urlretrieve(sample_image_url, target_image)
        print(f"Sample image downloaded to {target_image}")
        return True
    except Exception as e:
        print(f"Error downloading image: {e}")
        return False

def add_exif_data():
    """Add the flag to the EXIF data of the image."""
    try:
        # Load existing exif data or create new if none exists
        try:
            exif_dict = piexif.load(target_image)
        except:
            exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}
        
        # Add flag to EXIF comment
        exif_dict["0th"][piexif.ImageIFD.XPComment] = FLAG.encode("utf-16le")
        
        # Also add a hint in another field to make it slightly easier
        exif_dict["Exif"][piexif.ExifIFD.UserComment] = b"Important security information hidden in this image."
        
        # Convert dict to bytes
        exif_bytes = piexif.dump(exif_dict)
        
        # Insert EXIF data into image
        piexif.insert(exif_bytes, target_image)
        print(f"Flag embedded in EXIF data of {target_image}")
        return True
    except Exception as e:
        print(f"Error adding EXIF data: {e}")
        return False

def main():
    """Main function to create the challenge artifact."""
    # Check if an image already exists in the artifacts directory
    if not os.path.exists(target_image):
        if not download_sample_image():
            print("Failed to create challenge artifact.")
            return False
    
    # Add EXIF data with the flag
    if not add_exif_data():
        print("Failed to add EXIF data.")
        return False
    
    print("\nChallenge artifact created successfully!")
    print(f"The flag is hidden in the EXIF data of {target_image}")
    return True

if __name__ == "__main__":
    # Check if PIL and piexif are installed
    try:
        import PIL
        import piexif
    except ImportError:
        print("Error: Required packages not found.")
        print("Please install required packages with: pip install pillow piexif")
        sys.exit(1)
    
    main() 