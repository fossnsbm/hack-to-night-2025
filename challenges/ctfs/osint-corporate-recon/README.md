# Corporate Reconnaissance

## Challenge Setup

1. Create a mock company website for "TechnoCore Industries" with:
   - Team page listing key employees
   - Public Github organization link
   - Reference to cloud storage buckets
   - Job listings page with technology stack information
   - Mentions of company projects and products

2. Create a GitHub repository for the company with:
   - Code commits containing accidentally exposed API keys (marked as revoked)
   - Configuration files with internal server names
   - Issues mentioning internal infrastructure details
   - A security vulnerability in a public repository

3. Create mock cloud storage:
   - A publicly accessible bucket with company documents
   - An improperly secured asset containing part of the flag

## Solution Guide

1. Start with the company website to identify key information:
   - Employee names and roles
   - Technology stack
   - GitHub organization link
   - Cloud provider mentions

2. Search the GitHub repositories:
   - Find exposed API keys in commit history
   - Identify internal server naming conventions
   - Discover security vulnerabilities mentioned in issues
   - Locate config files with sensitive information

3. Search for exposed cloud resources:
   - Use tools like GrayhatWarfare to find public buckets
   - Search using company name patterns
   - Download and analyze exposed documents
   - Find the partial flag in exposed assets

4. Combine all information to form the flag:
   flag{3xp0s3d_g1thub_c0mm1ts_4nd_cl0ud_4ss3ts}

## Deployment Notes

- Create a static website for the company
- Set up a GitHub organization with repositories containing the required information
- Create mock screenshots of cloud storage findings
- Host all assets on the challenge server 