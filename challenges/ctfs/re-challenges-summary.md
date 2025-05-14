# Hard Reverse Engineering Challenges Summary

## 1. Obfuscated Virtualization (450 points)
- **Description**: A binary that implements a custom virtual machine with its own instruction set to validate a password
- **Skills**: VM architecture analysis, bytecode reverse engineering, algorithm reconstruction
- **Flag**: `flag{v1rtu4l1z3d_0bfusc4t10n_1s_h4rd_t0_cr4ck}`
- **Key Challenge Elements**:
  - Custom virtual machine implementation
  - 25+ unique opcodes with various functions
  - Obfuscated bytecode verification algorithm
  - Multiple-stage transformation of input data

## 2. Polymorphic Malware (500 points)
- **Description**: A binary that modifies its own code at runtime, generating different variants of its functions
- **Skills**: Self-modifying code analysis, dynamic debugging, memory forensics
- **Flag**: `flag{s3lf_m0d1fy1ng_c0d3_1s_h4rd_t0_4n4lyz3}`
- **Key Challenge Elements**:
  - Runtime code generation and execution
  - Dynamic code transformation
  - Junk code insertion techniques
  - Memory protection mechanism usage

## Technical Implementation Details

### Obfuscated Virtualization
- Implements a complete virtual machine architecture
- Includes registers, memory, stack, and program counter
- Features rich instruction set with arithmetic, logical, control flow operations
- Password verification occurs through bytecode executed in the VM
- Each byte of input undergoes a multi-step transformation algorithm

### Polymorphic Malware
- Uses memory mapping (mmap) to create executable memory regions
- Copies templates of functions and modifies them at runtime
- Inserts random junk instructions that don't affect functionality
- Changes binary signature each time the program runs
- Encrypted flag is decrypted using polymorphic code

## Deployment Requirements

All challenges are provided as source code that can be compiled for the target environment:

1. Compilation:
   ```
   cd challenges/ctfs/re-obfuscated-vm
   make
   
   cd ../re-polymorphic-malware
   make
   ```

2. Deployment:
   - Both challenges are standalone binaries that can be distributed
   - No network services required
   - Works on most Linux environments
   - May require libgcc for runtime support

## Solution Strategy

Both challenges are designed to teach different aspects of advanced reverse engineering:

- **Obfuscated VM**: Focuses on understanding virtualization-based obfuscation and custom instruction sets
- **Polymorphic Malware**: Focuses on self-modifying code techniques and dynamic analysis

Estimated completion time for experienced participants: 2-5 hours per challenge
Recommended tools: Ghidra/IDA Pro, GDB/x64dbg, Python for scripting solutions 