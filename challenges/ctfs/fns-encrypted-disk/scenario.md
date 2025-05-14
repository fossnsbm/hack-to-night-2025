# Locked Away Challenge Scenario

## CONFIDENTIAL: Incident Response Investigation

**Date**: June 15, 2023  
**Case ID**: IR-2023-0615  
**Subject**: Suspected Data Exfiltration by Employee  

### Background

An employee in our R&D department, Alex Morgan, was suspected of stealing proprietary research data after a security alert flagged unusual file access patterns. Alex was accessing sensitive project files that were not related to their current assignments.

When confronted by management, Alex denied any wrongdoing but seemed nervous. The IT security team was instructed to secure Alex's laptop for further investigation, but by the time the security team arrived at Alex's desk, they found that Alex had encrypted their work drive.

### Evidence Collection

The IT security team took the following actions:

1. Alex's laptop was immediately isolated from the network
2. A memory dump was taken while the encrypted drive was still mounted and accessible
3. The laptop was then powered down and taken to the forensics lab
4. A full disk image was taken, which confirmed that the work drive had been encrypted

### Your Task

As a digital forensics expert, your task is to:

1. Analyze the memory dump to extract the encryption key(s)
2. Use the recovered key(s) to decrypt the encrypted volume
3. Search the decrypted volume for evidence of data exfiltration
4. Locate any stolen data or indicators of how data was exfiltrated

### Available Evidence

You have been provided with:
1. A memory dump taken while the encrypted volume was still mounted
2. The encrypted volume file extracted from the disk image

### Legal Authorization

This investigation has been approved by legal counsel under company policy section 8.3, which permits forensic examination of company equipment when data theft is suspected. All findings should be treated as confidential and reported only to the incident response team lead.

---

*For this CTF challenge, your goal is to recover the encryption key from the memory dump, decrypt the volume, and find the flag hidden in the recovered data.* 