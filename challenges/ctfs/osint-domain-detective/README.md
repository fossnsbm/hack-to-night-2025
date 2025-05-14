# Domain Detective

## Challenge Setup

1. Create a mock WHOIS record for the domain 'securityupdate-portal.com' with:
   - Registration date: 2023-02-15
   - Registrar: PrivacyGuardian.org
   - Initially privacy-protected registration details
   - Historical WHOIS showing the domain was previously registered to "John Malkovich" with email "johnm@malicious-actors.net"

2. Create mock DNS records including:
   - A records pointing to suspicious IPs
   - MX records showing mail is handled by a third-party service
   - Historical DNS changes showing server migrations
   - TXT records with SPF information

3. Create screenshots of:
   - Historical webpage captures showing the evolution of the phishing site
   - Passive DNS data
   - SSL certificate information
   - IP geolocation data

## Solution Guide

1. WHOIS Investigation:
   - Look up current WHOIS data for securityupdate-portal.com
   - Find historical WHOIS data using services like SecurityTrails or DomainTools
   - Identify the original registrant before privacy protection
   - Note the creation date (2023-02-15)

2. DNS Analysis:
   - Check current DNS records (A, MX, NS, TXT)
   - Analyze historical DNS records
   - Map the infrastructure through IP addresses
   - Look for patterns in naming or IP ranges

3. Additional Research:
   - Check historical website captures on Wayback Machine
   - Analyze SSL certificate data for additional domains
   - Check passive DNS for other domains on same IPs
   - Research associated email addresses

4. Compile findings to form the flag:
   flag{wh01s_h1st0ry_dns_r3c0rds_r3v34l_4ll}

## Deployment Notes

- Create mock screenshots and data files for all the necessary records
- Host a web interface that allows participants to query for different types of information
- Create a timeline of domain activity for participants to analyze
- Include some red herrings that require careful analysis to filter out 