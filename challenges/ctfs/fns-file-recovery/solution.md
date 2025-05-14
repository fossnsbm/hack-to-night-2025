# Solution Guide: File Recovery Challenge

This document provides the solution method for the "Digital Detective: File Recovery" challenge.

## Challenge Summary
A disk image containing a deleted file with credentials needs to be analyzed to recover the flag.

## Solution Steps

### Method 1: Using `strings` (Easiest)
The simplest approach is to use the `strings` command to extract all readable text from the disk image:

```bash
strings disk.img | grep flag
```

This should display: `flag{f0r3ns1cs_r3c0v3ry_m4st3r}`

### Method 2: Using TestDisk or PhotoRec (Intermediate)
1. Download and install TestDisk/PhotoRec from https://www.cgsecurity.org/wiki/TestDisk_Download
2. Run PhotoRec:
   ```bash
   photorec disk.img
   ```
3. Follow the on-screen instructions to recover deleted files
4. Open the recovered text file to find the flag

### Method 3: Using `foremost` (Intermediate)
1. Install foremost: `apt-get install foremost` (Linux) or use a forensics distribution
2. Run the tool on the disk image:
   ```bash
   foremost -t txt -i disk.img -o recovered
   ```
3. Check the recovered text files in the output directory for the flag

## Expected Output
After recovery, you should find a text file containing:
```
flag{f0r3ns1cs_r3c0v3ry_m4st3r}
```

## Learning Objectives
This challenge teaches participants:
1. Basic file recovery techniques
2. Understanding of how file deletion works (files aren't immediately wiped)
3. Use of common digital forensics tools 