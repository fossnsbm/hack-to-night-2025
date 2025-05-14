# Locked Away Challenge

## Challenge Overview
This hard difficulty forensics challenge combines memory forensics with disk encryption. Participants must analyze a memory dump to extract encryption keys for a BitLocker or VeraCrypt encrypted volume, then use those keys to decrypt the volume and find the flag.

## Challenge Creation Instructions
1. Create a memory dump containing encryption keys for an encrypted volume
2. Create an encrypted volume containing the flag and other files
3. The key should be extractable from the memory dump using forensic tools
4. When decrypted, the volume should contain a file with the flag: `flag{m3m0ry_n3v3r_f0rg3ts_th3_k3ys}`

## Setup Instructions

### For BitLocker Volume (Windows)
1. Create a virtual machine with Windows 10/11
2. Create a new virtual disk (VHD) that will be encrypted:
   ```powershell
   # Create a new 100MB VHD file
   New-VHD -Path C:\BitLockerTest.vhd -SizeBytes 100MB -Dynamic
   # Mount the VHD
   Mount-DiskImage -ImagePath C:\BitLockerTest.vhd
   # Get the disk number
   $disk = Get-DiskImage -ImagePath C:\BitLockerTest.vhd | Get-Disk
   # Initialize the disk
   Initialize-Disk -Number $disk.Number -PartitionStyle MBR
   # Create a partition and format it
   $partition = New-Partition -DiskNumber $disk.Number -UseMaximumSize -AssignDriveLetter
   Format-Volume -DriveLetter $partition.DriveLetter -FileSystem NTFS -NewFileSystemLabel "SecretData" -Confirm:$false
   ```

3. Place the flag and other files on the volume:
   ```powershell
   # Create the flag file
   Set-Content -Path "$($partition.DriveLetter):\flag.txt" -Value "flag{m3m0ry_n3v3r_f0rg3ts_th3_k3ys}"
   # Add some other files for realism
   Copy-Item C:\Windows\System32\*.dll -Destination "$($partition.DriveLetter):\" -ErrorAction SilentlyContinue -MaxCount 5
   ```

4. Enable BitLocker on the volume:
   ```powershell
   # Enable BitLocker with a password
   $password = ConvertTo-SecureString -String "Sup3rS3cr3tP4ssw0rd!" -AsPlainText -Force
   Enable-BitLocker -MountPoint $partition.DriveLetter -PasswordProtector -Password $password
   ```

5. Take a memory dump while the volume is mounted:
   ```powershell
   # Use tools like DumpIt or WinPmem
   # For example, with WinPmem:
   .\winpmem.exe memory.raw
   ```

6. Unmount the VHD:
   ```powershell
   Dismount-DiskImage -ImagePath C:\BitLockerTest.vhd
   ```

### For VeraCrypt Volume (Alternative)
1. Create a VeraCrypt volume:
   - Download and install VeraCrypt
   - Create a 100MB encrypted container with a password (e.g., "Sup3rS3cr3tP4ssw0rd!")
   - Mount the volume and add the flag file and decoy files
   - Keep the volume mounted

2. Take a memory dump while the volume is mounted
   - Use tools like DumpIt, WinPmem, or LiME (for Linux)

3. Dismount the VeraCrypt volume

## Expected Solution

Participants will need to:

1. Analyze the memory dump to extract the encryption key:
   
   **For BitLocker:**
   ```bash
   # Using Volatility and plugins like mimikatz:
   volatility -f memory.raw --profile=Win10x64_19H1 mimikatz
   
   # Or using specialized tools like Elcomsoft Forensic Disk Decryptor or passware
   ```

   **For VeraCrypt:**
   ```bash
   # Using specialized tools like VeraCrypt Memory Forensics or Passware Kit
   # Or custom scripts that search for VeraCrypt key patterns in memory
   ```

2. Use the extracted key to decrypt the volume:
   
   **For BitLocker:**
   ```powershell
   # Using recovered key with BitLocker repair tools or specialized forensic tools
   Unlock-BitLocker -MountPoint D: -RecoveryPassword $recoveredKey
   ```

   **For VeraCrypt:**
   ```bash
   # Mount using recovered password
   veracrypt --mount /path/to/encrypted_volume.hc /mount/point --password=$recoveredPassword
   ```

3. Access the decrypted volume and find the flag file

## Artifact Packaging
Package the following files for the challenge:
1. The memory dump (compressed with 7z for size)
2. The encrypted volume file
3. A brief document describing the scenario (employee suspected of leaking data)

## Hints (if needed)
- "The encryption keys must be in memory somewhere. Have you tried tools specifically designed for memory forensics of encrypted volumes?"
- "BitLocker keys are stored in multiple formats in memory. Look for Full Volume Encryption Key (FVEK) or Volume Master Key (VMK)."
- "Sometimes you need to combine multiple forensic tools to extract the encryption keys from memory dumps." 