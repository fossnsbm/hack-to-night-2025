# Solution Guide: Digital Crime Scene Challenge

This document provides the solution method for the "Digital Crime Scene" forensics challenge.

## Challenge Summary
The challenge requires analyzing multiple artifacts to reconstruct a sophisticated cyber attack timeline and discover how data was exfiltrated, ultimately finding the flag hidden in the exfiltrated data.

## Solution Steps

### Step 1: Initial Analysis and Organization
Begin by organizing the provided evidence files:

```bash
# Extract compressed archives
unzip system_logs.zip -d ./evidence/logs/
7z x disk_image.7z -o./evidence/disk/
7z x memory.7z -o./evidence/memory/

# Create a working directory for analysis
mkdir ./analysis
```

### Step 2: Examine the Phishing Email
Analyze the email.eml file to understand the initial attack vector:

```bash
# View the email content
cat email.eml
# Extract the attachment
munpack -t email.eml
```

Key findings:
- Email sent from `attacker@malicious-domain.com` to `victim@target-corp.com`
- Subject: "Urgent Invoice Review"
- Contains a malicious document attachment: `Invoice_05152023.doc`
- Timestamp: May 15, 2023, 09:23:45 -0700

### Step 3: Analyze System Logs
Examine the system logs to trace what happened after the phishing email was opened:

```bash
# For Windows Event Logs
Get-WinEvent -Path ./evidence/logs/Security.evtx | Where-Object { $_.TimeCreated -ge "2023-05-15" } | Format-List

# For Linux logs
grep "May 15" ./evidence/logs/auth.log
```

Key events to identify:
1. Document execution (approximately 09:30 AM)
2. PowerShell execution with encoded commands
3. Privilege escalation attempts (UAC bypass or exploits)
4. New service creation or scheduled task (persistence)
5. Evidence of lateral movement attempts

### Step 4: Analyze the Disk Image
Mount and analyze the disk image to find traces of attacker activity:

```bash
# Mount the disk image (read-only)
mount -o ro,loop ./evidence/disk/disk_image ./mnt/disk_image

# Look for interesting files
find ./mnt/disk_image -type f -mtime -2 -ls
grep -r "malicious" ./mnt/disk_image/
```

Key findings to look for:
1. Malicious document in the Downloads folder
2. PowerShell history files showing commands
3. Configuration files for exfiltration tools
4. Staging directories where data was collected before exfiltration
5. Browser history showing reconnaissance

### Step 5: Analyze Network Traffic
Examine the PCAP file to identify command and control traffic and data exfiltration:

```bash
# Basic statistics
capinfos network.pcap

# Look for unusual connections
tshark -r network.pcap -T fields -e ip.dst -e tcp.dstport | sort | uniq -c | sort -nr

# Examine DNS queries for potential DNS tunneling
tshark -r network.pcap -Y "dns" -T fields -e dns.qry.name | sort | uniq -c

# Check for unusual ICMP traffic (potential ICMP tunneling)
tshark -r network.pcap -Y "icmp" -T fields -e ip.dst -e icmp.type | sort | uniq -c

# Follow TCP streams for potential C2 traffic
wireshark -r network.pcap
```

### Step 6: Correlate Events for Timeline Construction
Use the provided partial timeline and fill in the gaps with your findings:

```bash
# Start with the provided timeline
cp ./initial_timeline.csv ./analysis/complete_timeline.csv

# Add additional events you've discovered
```

Critical events to add:
1. Initial email delivery (09:23:45)
2. Document opening and macro execution
3. Initial C2 connection
4. Privilege escalation
5. Lateral movement
6. Data staging
7. Data exfiltration

### Step 7: Identify the Data Exfiltration Method
Based on the network analysis, determine how data was exfiltrated:

**For DNS Tunneling:**
```bash
# Extract suspicious DNS queries
tshark -r network.pcap -Y "dns" -T fields -e dns.qry.name | grep -i "base64" > dns_exfil.txt

# Decode the exfiltrated data
cat dns_exfil.txt | sed 's/.*base64//g' | tr -d '.' | base64 -d > extracted_data.bin
```

**For Steganography:**
```bash
# Extract suspicious image files from the PCAP
tshark -r network.pcap -Y "http.request.method==GET && http.file_data contains JPG" -T fields -e http.file_data > suspicious_image.jpg

# Use steganography tools to extract hidden data
steghide extract -sf suspicious_image.jpg -p "password"
```

**For ICMP Tunneling:**
```bash
# Extract ICMP data payloads
tshark -r network.pcap -Y "icmp.type==8" -T fields -e data > icmp_data.bin

# Remove headers and decode
cat icmp_data.bin | cut -c 17- | xxd -r -p > extracted_data.bin
```

### Step 8: Extract the Flag
Analyze the exfiltrated data to find the flag:

```bash
# Look for the flag pattern in the extracted data
strings extracted_data.bin | grep -i "flag{"

# If the data is encrypted, use the key found in other evidence
openssl enc -d -aes-256-cbc -in extracted_data.bin -out decrypted_data.bin -k "keyFoundInEvidence"

# Check the decrypted data for the flag
strings decrypted_data.bin | grep -i "flag{"
```

The flag should be: `flag{f0r3ns1c_t1m3l1n3_r3c0nstruct10n_FTW}`

### Step 9: Document the Complete Attack Scenario
Construct the full timeline and document the attack stages:

1. **Initial Access** (May 15, 2023, 09:23:45):
   - Phishing email with malicious document attachment
   - Macro execution leading to initial foothold

2. **Privilege Escalation** (May 15, 2023, 09:35-09:45):
   - [Document specific technique found in logs]
   - [Include relevant commands or exploits used]

3. **Persistence** (May 15, 2023, 09:50-10:00):
   - [Document persistence mechanism]
   - [Include relevant registry keys or scheduled tasks]

4. **Lateral Movement** (May 15, 2023, 10:15-11:30):
   - [Document technique used to move between systems]
   - [Include compromised credentials or exploits used]

5. **Data Collection** (May 15, 2023, 11:45-13:15):
   - [Document what data was targeted]
   - [Include staging directories or compression techniques]

6. **Data Exfiltration** (May 15, 2023, 13:30-14:00):
   - [Document exfiltration method]
   - [Include details on how data was encoded/encrypted]

## Learning Objectives
This challenge teaches participants:
1. Multi-artifact correlation and timeline analysis
2. Attack stage identification and reconstruction
3. Data exfiltration detection techniques
4. Working with different evidence formats (logs, disk images, network captures)
5. Advanced forensic investigation skills in a complex scenario 