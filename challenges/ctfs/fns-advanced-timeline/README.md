# Digital Crime Scene Challenge

## Challenge Overview
This advanced forensics challenge focuses on timeline analysis and attack reconstruction. Participants must analyze multiple artifacts (logs, disk images, memory dumps) to piece together a complex attack scenario, following the attacker's path through the network to eventually discover how data was exfiltrated and what the flag is.

## Challenge Creation Instructions
1. Create a realistic attack scenario with multiple stages
2. Generate artifacts (logs, disk images, timeline data) showing evidence of the attack
3. Hide the flag in an exfiltrated data package that participants must discover
4. The flag should be: `flag{f0r3ns1c_t1m3l1n3_r3c0nstruct10n_FTW}`

## Setup Instructions

### 1. Create the Attack Scenario
Design a multi-stage attack that includes:
- Initial access via a phishing email with a malicious document
- Exploitation of a vulnerability for privilege escalation
- Lateral movement to other systems
- Data exfiltration via an unusual channel (e.g., DNS tunneling, steganography)

### 2. Generate Evidence Files

#### 2.1 Email Artifacts
Create an EML file showing the phishing email:
```
From: attacker@malicious-domain.com
To: victim@target-corp.com
Subject: Urgent Invoice Review
Date: Mon, 15 May 2023 09:23:45 -0700
X-Mailer: Evil Mailer 1.0
Content-Type: multipart/mixed; boundary="boundary-string"

--boundary-string
Content-Type: text/plain

Hello,

Please review the attached invoice urgently. We need your approval to process the payment today.

Regards,
Accounting Team

--boundary-string
Content-Type: application/msword; name="Invoice_05152023.doc"
Content-Disposition: attachment; filename="Invoice_05152023.doc"
Content-Transfer-Encoding: base64

[BASE64-ENCODED MALICIOUS DOCUMENT]
--boundary-string--
```

#### 2.2 System Logs
Create Windows Event Logs or Linux syslog files showing:
- Document execution
- PowerShell/cmd commands for reconnaissance
- Privilege escalation attempts
- Service creation for persistence
- Unusual network connections

#### 2.3 Network Traffic
Generate a PCAP file with:
- Initial C2 communication
- Lateral movement attempts (SMB, RDP, SSH, etc.)
- Data exfiltration traffic (hidden in DNS, ICMP, or other protocols)

#### 2.4 Disk Image
Create a small disk image containing:
- Evidence of deleted data staging files
- Configuration files for the exfiltration tool
- Command history showing attacker actions
- Browser history showing additional reconnaissance

#### 2.5 Memory Dump (Optional)
Include a small, focused memory dump showing:
- Running malicious processes
- Network connections
- Decrypted command and control traffic

### 3. Create the Timeline Data
Use timeline tools (e.g., log2timeline/plaso) to generate a complex timeline of events from all sources, but with some gaps that participants need to fill in through analysis.

### 4. Hide the Flag
Hide the flag in an exfiltrated data package that can only be found by:
1. Identifying the exfiltration method in the network traffic
2. Extracting and decoding the exfiltrated data
3. Possibly decrypting it with a key found elsewhere in the evidence

## Evidence Packaging
Package the artifacts into separate files:
1. `email.eml` - The phishing email
2. `system_logs.zip` - System and application logs
3. `network.pcap` - Network capture of the attack
4. `disk_image.7z` - Compressed, small disk image
5. `memory.7z` - Compressed, small memory dump (optional)
6. `initial_timeline.csv` - Partial timeline with gaps

## Expected Solution

Participants will need to:

1. Review all evidence to establish an initial understanding of the attack
2. Identify the phishing email as the initial access vector
3. Follow the attack progression through system logs and timeline data
4. Discover lateral movement techniques and compromised systems
5. Identify the data exfiltration method in the network traffic
6. Extract and decode the exfiltrated data to find the flag
7. Document the complete attack timeline with all relevant IOCs

## Solution Milestones
For scoring purposes, you may want to include incremental flags or checkpoints:
1. Initial access identification
2. Privilege escalation method
3. Lateral movement technique
4. Exfiltration channel discovery
5. Final flag extraction

## Hints (if needed)
- "Multi-source timeline analysis requires correlation across different time zones and formats."
- "The exfiltration method may be obscured - look for patterns in seemingly normal traffic."
- "Don't just focus on what's there - sometimes what's missing or deleted is just as important."
- "Consider using specialized forensic tools for timeline reconstruction, like log2timeline/plaso." 