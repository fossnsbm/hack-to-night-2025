This directory will contain the files needed for the Digital Crime Scene challenge.

The challenge requires the following artifacts:
1. email.eml - Phishing email that initiated the attack
2. system_logs.zip - Collection of system and application logs
3. network.pcap - Network capture showing the attack traffic
4. disk_image.7z - Compressed disk image with evidence files
5. memory.7z (optional) - Compressed memory dump from compromised system
6. initial_timeline.csv - Partial timeline data with gaps for participants to fill

Please follow the setup instructions in the parent directory's README.md to create these artifacts.

Note: For this complex challenge, consider creating the artifacts incrementally by:
1. Setting up a controlled lab environment
2. Executing the attack steps described in the README
3. Collecting evidence after each phase
4. Sanitizing the data to focus on relevant artifacts
5. Ensuring the total size of all artifacts is reasonable for a CTF challenge 