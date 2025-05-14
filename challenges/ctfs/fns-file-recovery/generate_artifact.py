#!/usr/bin/env python3
"""
Script to generate the disk image artifact for the 'File Recovery' challenge.
This script creates a virtual disk image with a deleted file containing the flag.
"""

import os
import sys
import subprocess
import tempfile
import shutil

# Ensure the artifacts directory exists
artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
os.makedirs(artifacts_dir, exist_ok=True)

# Flag to embed in the disk image
FLAG = "flag{f0r3ns1cs_r3c0v3ry_m4st3r}"

# Target disk image path
disk_image = os.path.join(artifacts_dir, "disk.img")

def is_windows():
    """Check if we're running on Windows."""
    return os.name == 'nt'

def create_disk_image_windows():
    """Create a disk image on Windows."""
    print("Creating disk image on Windows...")
    
    # Create a temp directory for the disk contents
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create the credentials file with the flag
        credentials_path = os.path.join(temp_dir, "credentials.txt")
        with open(credentials_path, 'w') as f:
            f.write(FLAG)
        
        # Get file contents for forensic evidence
        with open(credentials_path, 'rb') as f:
            file_contents = f.read()
        
        # Delete the file to simulate file deletion
        os.remove(credentials_path)
        
        # Create a binary disk image with FAT32 structure and deleted file fragments
        # Note: This is a simplified version that just embeds the raw bytes of the file
        # with some context to make it recoverable with basic tools
        with open(disk_image, 'wb') as img:
            # Write a simple FAT32-like header
            img.write(b"MSDOS5.0" + b"\x00" * 53)
            
            # Write a fake file allocation table with some deleted entries
            img.write(b"credentials.txt" + b"\x00" * 4 + b"\xE5" + b"\x00" * 16)
            
            # Write some padding
            img.write(b"\x00" * 1024)
            
            # Write the actual file contents surrounded by some filesystem-like markers
            img.write(b"FILE_START" + b"\x00" * 10)
            img.write(file_contents)
            img.write(b"FILE_END" + b"\x00" * 10)
            
            # Add some more padding to make the image larger
            img.write(b"\x00" * 4096)
        
        print(f"Created simplified disk image at {disk_image}")
        print("Note: This is a simulated disk image for Windows.")
        print("For a more realistic image, consider using WSL or a Linux VM.")
        return True

def create_disk_image_unix():
    """Create a disk image on Unix-like systems."""
    try:
        # Create a 10MB disk image filled with zeros
        subprocess.run(["dd", "if=/dev/zero", f"of={disk_image}", "bs=1M", "count=10"], check=True)
        
        # Format the disk image with FAT32 filesystem
        subprocess.run(["mkfs.fat", "-F", "32", disk_image], check=True)
        
        # Create a temporary mount point
        with tempfile.TemporaryDirectory() as mount_point:
            # Mount the disk image
            subprocess.run(["sudo", "mount", "-o", "loop", disk_image, mount_point], check=True)
            
            # Create the credentials file with the flag
            credentials_path = os.path.join(mount_point, "credentials.txt")
            with open(credentials_path, 'w') as f:
                f.write(FLAG)
            
            # Delete the file to simulate file deletion
            os.remove(credentials_path)
            
            # Unmount the disk image
            subprocess.run(["sudo", "umount", mount_point], check=True)
        
        print(f"Disk image created at {disk_image}")
        return True
    except Exception as e:
        print(f"Error creating disk image: {e}")
        return False

def main():
    """Main function to create the challenge artifact."""
    # Check if the disk image already exists
    if os.path.exists(disk_image):
        print(f"Disk image already exists at {disk_image}")
        return True
    
    # Create the disk image based on the operating system
    if is_windows():
        return create_disk_image_windows()
    else:
        return create_disk_image_unix()

if __name__ == "__main__":
    main() 