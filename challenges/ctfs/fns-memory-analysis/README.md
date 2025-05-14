# Memory Lane Challenge

## Challenge Overview
This medium-to-hard forensics challenge involves memory forensics. Participants will need to analyze a memory dump to find evidence of a malicious process and extract hidden data.

## Challenge Creation Instructions
1. Create a small memory dump containing evidence of a suspicious process
2. The process should contain the flag in its memory or command-line arguments
3. The memory dump should be created with volatility-compatible tools
4. The flag should be: `flag{v0l4t1l1ty_4n4lys1s_f0r_th3_w1n}`

## Setup Instructions
1. Set up a virtual machine (Windows or Linux)
2. Run a "malicious" process that contains the flag:
   - For Windows: Create a process with the flag in its command line arguments
   - For Linux: Create a process with the flag in its environment variables or memory space
3. Example for Windows (PowerShell):
   ```powershell
   # Start a process with flag in arguments
   Start-Process notepad -ArgumentList "flag{v0l4t1l1ty_4n4lys1s_f0r_th3_w1n}"
   
   # Create a few other normal processes to add noise
   Start-Process calc
   Start-Process cmd -ArgumentList "/c ping 8.8.8.8"
   
   # Wait a moment for all processes to start
   Start-Sleep -Seconds 5
   
   # Take the memory dump using DumpIt, WinPmem, or another memory acquisition tool
   # Dump should be small enough to reasonably distribute (1-2GB max)
   ```

4. Example for Linux (Bash):
   ```bash
   # Start a process with flag in environment variable
   export SECRET_FLAG="flag{v0l4t1l1ty_4n4lys1s_f0r_th3_w1n}"
   python -c "import os; import time; print('Flag stored in memory'); time.sleep(3600)" &
   
   # Create some other processes for noise
   find / -name "*.txt" > /dev/null 2>&1 &
   ping 8.8.8.8 > /dev/null &
   
   # Take memory dump with LiME or other Linux memory acquisition tool
   # Reduce final size with a tool like lime-cut if needed
   ```

5. Place the memory dump file in the artifacts folder
   - For easier distribution, consider compressing the dump with 7zip or similar

## Expected Solution
Participants will:
1. Download and extract the memory dump
2. Use Volatility to analyze the memory dump:
   ```bash
   # For Volatility 2.x
   volatility -f memory.dmp --profile=<appropriate_profile> pslist  # List processes
   volatility -f memory.dmp --profile=<appropriate_profile> cmdline  # Check command lines
   volatility -f memory.dmp --profile=<appropriate_profile> memdump -p <suspicious_pid> -D output/  # Dump process memory
   
   # For Volatility 3
   python3 vol.py -f memory.dmp windows.pslist  # List processes
   python3 vol.py -f memory.dmp windows.cmdline  # Check command lines
   python3 vol.py -f memory.dmp windows.memmap --pid <suspicious_pid> --dump  # Dump process memory
   ```
3. Find suspicious processes in the process list
4. Examine the process details to find the flag
5. Alternative approach: Use strings on the memory dump and grep for "flag"

## Hints (if needed)
- "Look at the list of running processes. Any unusual ones?"
- "Command-line arguments can reveal a lot about a process's purpose."
- "Try dumping the memory of suspicious processes for deeper analysis." 