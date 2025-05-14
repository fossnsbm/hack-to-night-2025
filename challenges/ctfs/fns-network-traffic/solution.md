# Solution Guide: Suspicious Traffic Challenge

This document provides the solution method for the "Suspicious Traffic" challenge.

## Challenge Summary
The challenge involves analyzing a network packet capture file to detect data exfiltration through DNS queries.

## Solution Steps

### Step 1: Open the PCAP in Wireshark
First, open the capture.pcap file in Wireshark.

### Step 2: Filter for DNS Traffic
Apply a display filter to focus on DNS traffic:
```dns
```

### Step 3: Identify Suspicious Queries
Looking at the DNS queries, notice a pattern of queries to subdomains of `exfil.malicious.com`:
- `66.6c.61.67.exfil.malicious.com`
- `44.4e.53.5f.exfil.malicious.com`
- `33.78.66.31.exfil.malicious.com`
- ...etc.

### Step 4: Extract the Encoded Data
Extract all the subdomain prefixes and combine them:
```
66.6c.61.67.44.4e.53.5f.33.78.66.31.6c.74.72.34.74.31.30.6e.5f.31.73.5f.63.6c.33.76.33.72
```

### Step 5: Decode the Hex Data
Convert the hex values to ASCII. You can use various tools:

**Using Python:**
```python
encoded = "66.6c.61.67.44.4e.53.5f.33.78.66.31.6c.74.72.34.74.31.30.6e.5f.31.73.5f.63.6c.33.76.33.72"
# Remove the dots
encoded = encoded.replace(".", "")
# Convert hex to ASCII
decoded = bytes.fromhex(encoded).decode('utf-8')
print(decoded)
```

**Using CyberChef:**
1. Paste the encoded string
2. Remove the dots (using "Find / Replace")
3. Apply the "From Hex" operation

**Using an online hex decoder:**
1. Remove the dots
2. Paste into a hex-to-ASCII converter

### Step 6: Get the Flag
After decoding, you'll get: `flagDNS_3xf1ltr4t10n_1s_cl3v3r`

Format it properly as: `flag{DNS_3xf1ltr4t10n_1s_cl3v3r}`

## Alternative Methods

### Using Tshark from the Command Line
Extract DNS queries and process them:
```bash
tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name | grep "exfil.malicious.com" | sed 's/\.exfil\.malicious\.com//' | tr -d '\n' | tr -d '.' | xxd -r -p
```

### Using NetworkMiner
1. Open the PCAP in NetworkMiner
2. Go to the "DNS" tab
3. Look for patterns in the queries to `exfil.malicious.com`

## Learning Objectives
This challenge teaches participants:
1. DNS exfiltration techniques and detection
2. Using Wireshark effectively to analyze network traffic
3. Decoding encoded data
4. Recognizing patterns in suspicious communications 