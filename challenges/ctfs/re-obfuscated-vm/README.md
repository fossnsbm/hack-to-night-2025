# Obfuscated Virtualization

## Challenge Description
A binary that runs a custom virtual machine with its own instruction set. Participants must reverse engineer the VM architecture, understand the bytecode, and figure out how the password validation works.

## Challenge Setup

1. Compile the VM challenge:
   ```
   make
   ```

2. Optionally strip debug symbols to make it more challenging:
   ```
   strip vm_challenge
   ```

3. Consider additional obfuscation techniques:
   - Use a packer like UPX
   - Apply control flow flattening
   - Add anti-debugging techniques
   - Implement junk code

## Challenge Solution

To solve this challenge, participants need to:

1. Identify that the binary implements a custom virtual machine
2. Reverse engineer the VM architecture:
   - Map out opcodes and their functions
   - Understand register usage
   - Trace memory access patterns
   - Identify the bytecode verification logic

3. Extract and analyze the bytecode:
   - Map out the verification algorithm
   - Understand the custom transformation used on input
   - Determine the expected values for each character

4. Develop a solution:
   - Either reverse the transformation to get the original expected input
   - Or create a script that emulates the VM and brute-forces the solution

### Detailed Solution Steps

1. Use a disassembler (like Ghidra, IDA Pro, or radare2) to analyze the binary
2. Identify the VM components (registers, memory, instructions)
3. Locate the `vm_execute` function that processes opcodes
4. Extract the bytecode array used for verification
5. Disassemble the bytecode to understand its logic:
   - Character-by-character comparison
   - Each input character undergoes a transformation: 
     - Add a magic value (0x41)
     - Rotate left by 1
     - XOR with magic value
     - Modulo with magic value
     - Rotate right by 1
6. Reverse this algorithm to determine the input that produces the verification key
7. Input the reversed flag: `flag{v1rtu4l1z3d_0bfusc4t10n_1s_h4rd_t0_cr4ck}`

### Solution Script

A Python script to reverse the transformation and recover the password:

```python
def reverse_transform(key_byte, magic=0x41):
    # Reverse rotate right by 1
    val = ((key_byte << 1) | (key_byte >> 7)) & 0xFF
    
    # Reverse modulo (brute force approach)
    for i in range(256):
        if i % magic == val:
            val = i
            break
    
    # Reverse XOR
    val = val ^ magic
    
    # Reverse rotate left by 1
    val = ((val >> 1) | (val << 7)) & 0xFF
    
    # Reverse addition
    val = (val - magic) & 0xFF
    
    return val

# The key bytes from the bytecode (this would be extracted from the binary)
key_bytes = [0xAE, 0x8F, 0xC2, 0xB3, ...]  # Complete with all key bytes

# Recover the original flag
flag = ''.join(chr(reverse_transform(b)) for b in key_bytes)
print(flag)
```

## Challenge Analysis

### Difficulty Elements
- Custom VM architecture (requires understanding of low-level concepts)
- Obfuscated bytecode (requires careful manual analysis)
- Multi-step transformation algorithm (adds complexity)
- Complex control flow (makes tracing harder)

### Learning Objectives
- Virtual machine architecture
- Bytecode analysis
- Algorithm reversal
- Binary instrumentation techniques

### Estimated Solve Time
- 2-4 hours for experienced reverse engineers
- 5-8 hours for intermediate participants 