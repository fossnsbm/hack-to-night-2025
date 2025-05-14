# Solution Guide: Locked Away Challenge

This document provides the solution method for the "Locked Away" forensics challenge.

## Challenge Summary
The challenge involves analyzing a memory dump to extract encryption keys for a BitLocker or VeraCrypt volume, then using those keys to decrypt the volume and find the flag.

## Solution Steps

### Step 1: Determine the Encryption Type
First, examine the provided artifacts to determine what type of encryption is used:

```bash
# Check the volume file using file command
file encrypted_volume.vhd
# Look for BitLocker or VeraCrypt signatures
```

### Step 2: Memory Analysis for BitLocker Keys
If the volume is BitLocker encrypted:

#### Using Volatility Framework
```bash
# First identify the memory dump profile
volatility -f memory.raw imageinfo

# Use the correct profile for subsequent commands
volatility -f memory.raw --profile=Win10x64_19H1 pslist

# Look for BitLocker-related processes
volatility -f memory.raw --profile=Win10x64_19H1 psscan | grep -i bitlocker

# Use the mimikatz plugin to extract BitLocker keys
volatility -f memory.raw --profile=Win10x64_19H1 mimikatz

# Alternative: Use the bitlocker plugin if available
volatility -f memory.raw --profile=Win10x64_19H1 bitlocker
```

#### Using Specialized Tools
1. **Elcomsoft Forensic Disk Decryptor**:
   - Load the memory dump
   - Scan for BitLocker keys
   - Extract the Full Volume Encryption Key (FVEK)

2. **Passware Kit Forensic**:
   - Import the memory dump
   - Run BitLocker password/key recovery

### Step 3: Memory Analysis for VeraCrypt Keys
If the volume is VeraCrypt encrypted:

#### Using Memory Scanning Tools
```bash
# Look for VeraCrypt processes in memory
volatility -f memory.raw --profile=Win10x64_19H1 psscan | grep -i veracrypt

# Dump VeraCrypt process memory
volatility -f memory.raw --profile=Win10x64_19H1 memdump -p <VERACRYPT_PID> -D ./output/

# Run strings on the process memory to look for password patterns
strings ./output/<VERACRYPT_PID>.dmp | grep -A 2 -B 2 "password"
```

#### Using Specialized Tools
1. **Passware Kit Forensic**:
   - Import the memory dump
   - Run VeraCrypt password recovery

2. **VeraCrypt Memory Forensics**:
   - Use custom scripts to search for VeraCrypt key patterns

### Step 4: Extract the Found Key
Depending on the tool used, you'll obtain either:
- A recovery password (48-digit BitLocker recovery key)
- The Full Volume Encryption Key (FVEK)
- The VeraCrypt password or header key

Example output for BitLocker:
```
BitLocker recovery key: 236511-124594-571142-628987-541255-294544-428482-639585
```

Example output for VeraCrypt:
```
Password: Sup3rS3cr3tP4ssw0rd!
```

### Step 5: Decrypt the Volume
Use the recovered key to decrypt the volume:

#### For BitLocker:
```bash
# Using dislocker
dislocker -r -V encrypted_volume.vhd -p236511-124594-571142-628987-541255-294544-428482-639585 -- /mnt/dislocker
mount -o loop /mnt/dislocker/dislocker-file /mnt/decrypted

# Or using FTK Imager / AccessData FTK on Windows
# Import the recovery key when prompted
```

#### For VeraCrypt:
```bash
# Using VeraCrypt
veracrypt --text --mount encrypted_volume.hc /mnt/decrypted --password=Sup3rS3cr3tP4ssw0rd!
```

### Step 6: Extract the Flag
Browse the decrypted volume to find the flag:

```bash
cd /mnt/decrypted
find . -type f -exec grep -l "flag{" {} \;
cat flag.txt
```

The flag should be: `flag{m3m0ry_n3v3r_f0rg3ts_th3_k3ys}`

## Alternative Methods

### Memory String Search
If the specialized tools aren't working, you can try a direct memory string search:

```bash
# Search for common patterns in BitLocker/VeraCrypt keys
strings memory.raw | grep -i "fvek" -A 10 -B 10
strings memory.raw | grep -i -A 5 -B 5 "password"
strings memory.raw | grep -i "bitlocker" -A 20 -B 20
strings memory.raw | grep -i "veracrypt" -A 20 -B 20
```

### Volume Header Analysis
For VeraCrypt volumes, analyzing the volume header with recovered keys:

```bash
# Using cryptsetup (Linux)
cryptsetup tcryptDump encrypted_volume.hc --veracrypt
```

## Learning Objectives
This challenge teaches participants:
1. Advanced memory forensics techniques
2. Encryption key extraction from memory dumps
3. Working with encrypted volumes in a forensic context
4. BitLocker/VeraCrypt structure and encryption mechanisms 