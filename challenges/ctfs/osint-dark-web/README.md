# Dark Web Investigator

## Challenge Setup

This advanced OSINT challenge simulates a complex dark web investigation:

1. Create mock dark web marketplace listings:
   - Multiple marketplace screenshots showing data for sale
   - Seller profile "PhantomByte" with consistent PGP key
   - Sample data listings with pricing and descriptions
   - Communication channels (encrypted chat, email)

2. Create digital breadcrumbs connecting dark web to clear web:
   - Bitcoin transaction records showing payments
   - PGP key on public keyservers with metadata
   - Forum posts on security forums from same threat actor
   - Code repository contributions matching coding style

3. Create employee data suggesting insider threat:
   - LinkedIn profiles of company employees
   - Social media showing disgruntled employee
   - Resume/CV database entries
   - GitHub/code contributions matching PhantomByte's style

4. Create timeline of activities:
   - Employment dates at compromised company
   - Date of termination/leaving
   - Dark web marketplace registration dates
   - Data breach announcement and discovery

5. Create technical evidence files:
   - Network logs showing data exfiltration
   - Authentication logs showing suspicious access
   - Email correspondences suggesting insider knowledge
   - Stolen data sample with identifiable characteristics

## Solution Guide

This challenge requires sophisticated correlation and investigation techniques:

1. Dark Web Marketplace Analysis:
   - Identify "PhantomByte" across multiple marketplaces
   - Extract and verify PGP key information
   - Analyze communication patterns and writing style
   - Identify specific stolen data characteristics

2. Cryptocurrency Tracing:
   - Follow Bitcoin transactions from marketplace to exchanges
   - Identify withdrawal patterns and timing
   - Correlate transaction timing with real-world events
   - Find connections to clear web identities

3. Clear Web Correlation:
   - Match writing style to clear web personas
   - Analyze PGP key metadata for timezone/creation info
   - Find technical skills matching between dark/clear web
   - Identify employee with matching profile

4. Insider Threat Confirmation:
   - Confirm employment at breached company
   - Identify termination date just before breach
   - Find evidence of privilege abuse
   - Discover technical access that enabled the breach

5. Compile findings to form the flag:
   flag{d4rk_w3b_cr3d3nt14ls_tr4c3d_t0_1ns1d3r_thr34t}

## Deployment Notes

- Create a simulated dark web browsing interface
- Provide downloadable evidence packages
- Create a multi-stage investigation process with progressive disclosure
- Include realistic but fictional marketplace listings
- Ensure all content is clearly labeled as CTF/fictional material 