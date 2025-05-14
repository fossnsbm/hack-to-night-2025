This directory will contain the files needed for the Locked Away challenge.

The challenge requires the following artifacts:
1. memory.raw (or memory.raw.7z) - Memory dump taken while encrypted volume was mounted
2. encrypted_volume.vhd (or encrypted_volume.hc) - BitLocker or VeraCrypt encrypted volume
3. scenario.pdf - Brief scenario document explaining the situation

Please follow the setup instructions in the parent directory's README.md to create these artifacts.

Special Note: Memory dumps can be very large. Consider creating a small VM with minimal RAM (1-2GB)
and compressing the dump with 7zip using maximum compression to make it more manageable. 