# OSINT Challenges Summary

## Easy Challenges

### 1. Social Sleuth (100 points)
- **Description**: Track down a suspicious user across multiple social media platforms
- **Skills**: Social media analysis, metadata extraction, cross-platform correlation
- **Flag**: `flag{j0hn_sm1th_n3w_y0rk_h1dd3n_1n_pl41n_s1ght}`

### 2. Digital Footprint (150 points)
- **Description**: Analyze image metadata to identify the photographer and discovered vulnerability
- **Skills**: EXIF data analysis, geolocation, correlating technical information
- **Flag**: `flag{m3t4d4t4_n3v3r_l13s_c4m3r4_m0d3l_GP5}`

## Medium Challenges

### 3. Corporate Reconnaissance (250 points)
- **Description**: Perform passive information gathering on a company's online presence
- **Skills**: GitHub research, cloud resource discovery, employee information gathering
- **Flag**: `flag{3xp0s3d_g1thub_c0mm1ts_4nd_cl0ud_4ss3ts}`

### 4. Domain Detective (300 points)
- **Description**: Investigate a suspicious domain used in a phishing campaign
- **Skills**: WHOIS analysis, DNS investigation, historical website analysis
- **Flag**: `flag{wh01s_h1st0ry_dns_r3c0rds_r3v34l_4ll}`

## Hard Challenges

### 5. Global Intelligence Network (400 points)
- **Description**: Uncover details of a planned cyber attack using diverse intelligence sources
- **Skills**: Threat intelligence analysis, cryptocurrency investigation, IOC correlation
- **Flag**: `flag{p0w3r_gr1d_r4ns0mw4r3_jun3_15th_v14_ph1sh1ng}`

### 6. Dark Web Investigator (450 points)
- **Description**: Trace stolen data on dark web markets back to the insider threat
- **Skills**: Dark web research, cryptocurrency tracing, PGP analysis, insider threat identification
- **Flag**: `flag{d4rk_w3b_cr3d3nt14ls_tr4c3d_t0_1ns1d3r_thr34t}`

## Deployment Requirements

All challenges are containerized using Docker and can be deployed using the provided docker-compose files. Each challenge has its own directory under `challenges/ctfs/` with the following structure:

- `info.json`: Challenge metadata
- `README.md`: Setup and solution instructions
- `Dockerfile`: Container configuration
- `docker-compose.yml`: Multi-container orchestration
- `static/`: Web content and challenge assets

The OSINT challenges require minimal server resources as they primarily involve static content, with the exception of the Dark Web Investigator which includes an additional evidence server component. 