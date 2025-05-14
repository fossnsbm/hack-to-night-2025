# File Recovery Challenge

## Challenge Creation Instructions
1. Create a small disk image containing a deleted text file with the flag
2. The flag file should be named "credentials.txt" containing the flag text: `flag{f0r3ns1cs_r3c0v3ry_m4st3r}`
3. The disk image should be small (under 10MB) and formatted with a common file system (FAT32 or ext4)
4. The file should be recoverable using common tools like TestDisk, PhotoRec, or `foremost`

## Setup Instructions
1. Generate disk image:
   ```
   dd if=/dev/zero of=disk.img bs=1M count=10
   mkfs.fat -F 32 disk.img
   sudo mount -o loop disk.img /mnt
   sudo echo "flag{f0r3ns1cs_r3c0v3ry_m4st3r}" > /mnt/credentials.txt
   sudo rm /mnt/credentials.txt
   sudo umount /mnt
   ```
2. Place the resulting disk.img file in the artifacts folder

## Expected Solution
Participants will:
1. Download the disk image
2. Use a file recovery tool (TestDisk, PhotoRec, etc.) to recover the deleted file
3. Find the flag in the recovered file

## Hints (if needed)
- "Have you tried using file recovery tools? TestDisk and PhotoRec are useful."
- "The file you're looking for has a common name for storing sensitive information." 