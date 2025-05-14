# Solution Guide: Memory Lane Challenge

This document provides the solution method for the "Memory Lane" forensics challenge.

## Challenge Summary
The challenge requires analyzing a memory dump to find traces of a malicious process and extract a hidden flag.

## Solution Steps

### Step 1: Determine Memory Dump Profile
First, identify the correct profile for the memory dump using Volatility:

```bash
# For Volatility 2.x
volatility -f memory.dmp imageinfo

# For Volatility 3
python3 vol.py -f memory.dmp windows.info
```

### Step 2: List Running Processes
View the list of running processes at the time of the memory dump:

```bash
# For Volatility 2.x
volatility -f memory.dmp --profile=<PROFILE> pslist

# For Volatility 3
python3 vol.py -f memory.dmp windows.pslist
```

Look for unusual processes. In this case, pay special attention to:
- Notepad.exe (might be running with suspicious arguments)
- Any processes with unusual names or parent-child relationships

### Step 3: Examine Process Command Lines
Check the command line arguments for each process:

```bash
# For Volatility 2.x
volatility -f memory.dmp --profile=<PROFILE> cmdline

# For Volatility 3
python3 vol.py -f memory.dmp windows.cmdline
```

For the Windows scenario, you'll notice the notepad.exe process was launched with the flag as a command-line argument:
```
Process: notepad.exe
Command Line: "C:\Windows\system32\notepad.exe" flag{v0l4t1l1ty_4n4lys1s_f0r_th3_w1n}
```

### Step 4: Alternative - Check Environment Variables
If the flag was stored in environment variables (Linux scenario):

```bash
# For Volatility 2.x
volatility -f memory.dmp --profile=<PROFILE> linux_envars

# For Volatility 3
python3 vol.py -f memory.dmp linux.envars
```

Look for the SECRET_FLAG environment variable containing the flag.

### Step 5: Alternative - Memory String Search
If the above methods don't work, use strings to search the entire memory dump:

```bash
strings memory.dmp | grep -i "flag{"
```

Or for process-specific memory:

```bash
# For Volatility 2.x
volatility -f memory.dmp --profile=<PROFILE> memdump -p <PID> -D output/
strings output/pid.dmp | grep -i "flag{"

# For Volatility 3
python3 vol.py -f memory.dmp windows.memmap --pid <PID> --dump
strings pid.dmp | grep -i "flag{"
```

### Step 6: Extract the Flag
From the methods above, you should find: `flag{v0l4t1l1ty_4n4lys1s_f0r_th3_w1n}`

## Additional Analysis Options

### Process Tree View
Get a hierarchical view of processes:

```bash
# For Volatility 2.x
volatility -f memory.dmp --profile=<PROFILE> pstree

# For Volatility 3
python3 vol.py -f memory.dmp windows.pstree
```

### Network Connections
Check for network connections:

```bash
# For Volatility 2.x
volatility -f memory.dmp --profile=<PROFILE> netscan

# For Volatility 3
python3 vol.py -f memory.dmp windows.netscan
```

## Learning Objectives
This challenge teaches participants:
1. Basic memory forensics techniques
2. Using Volatility for memory analysis
3. Process enumeration and investigation
4. Command-line argument analysis
5. Finding evidence of suspicious activity in memory dumps 