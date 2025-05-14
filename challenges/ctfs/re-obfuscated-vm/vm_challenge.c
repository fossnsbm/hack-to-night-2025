#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

#define VM_MEMORY_SIZE 1024
#define VM_REGISTERS 16
#define VM_STACK_SIZE 256
#define VM_CODE_SIZE 512

// VM opcodes
typedef enum {
    OP_HALT = 0x00,     // Stop execution
    OP_LOAD = 0x01,     // Load immediate value into register
    OP_MOVE = 0x02,     // Move register value to another register
    OP_ADD = 0x03,      // Add registers
    OP_SUB = 0x04,      // Subtract registers
    OP_MUL = 0x05,      // Multiply registers
    OP_DIV = 0x06,      // Divide registers
    OP_XOR = 0x07,      // XOR registers
    OP_AND = 0x08,      // AND registers
    OP_OR = 0x09,       // OR registers
    OP_NOT = 0x0A,      // NOT register
    OP_LOAD_MEM = 0x0B, // Load from memory to register
    OP_STORE_MEM = 0x0C,// Store register to memory
    OP_JMP = 0x0D,      // Jump to address
    OP_JZ = 0x0E,       // Jump if zero
    OP_JNZ = 0x0F,      // Jump if not zero
    OP_PUSH = 0x10,     // Push register to stack
    OP_POP = 0x11,      // Pop from stack to register
    OP_CALL = 0x12,     // Call function
    OP_RET = 0x13,      // Return from function
    OP_CMP = 0x14,      // Compare registers and set flags
    OP_RANDOM = 0x15,   // Load random value into register
    OP_SHIFT_L = 0x16,  // Shift left
    OP_SHIFT_R = 0x17,  // Shift right
    OP_ROT_L = 0x18,    // Rotate left
    OP_ROT_R = 0x19,    // Rotate right
    OP_MOD = 0x1A,      // Modulo operation
} VMOpcode;

// VM structure
typedef struct {
    uint8_t memory[VM_MEMORY_SIZE];
    uint32_t registers[VM_REGISTERS];
    uint32_t stack[VM_STACK_SIZE];
    uint32_t pc;          // Program counter
    uint32_t sp;          // Stack pointer
    uint32_t code_size;
    uint8_t zero_flag;
    uint8_t running;
} VirtualMachine;

// Initialize the VM
void vm_init(VirtualMachine* vm) {
    memset(vm->memory, 0, VM_MEMORY_SIZE);
    memset(vm->registers, 0, VM_REGISTERS * sizeof(uint32_t));
    memset(vm->stack, 0, VM_STACK_SIZE * sizeof(uint32_t));
    vm->pc = 0;
    vm->sp = 0;
    vm->code_size = 0;
    vm->zero_flag = 0;
    vm->running = 1;
    
    // Seed random number generator
    srand(time(NULL));
}

// Load bytecode into VM memory
void vm_load_bytecode(VirtualMachine* vm, const uint8_t* bytecode, uint32_t size) {
    if (size > VM_CODE_SIZE) {
        printf("Bytecode too large!\n");
        return;
    }
    
    memcpy(vm->memory, bytecode, size);
    vm->code_size = size;
}

// Execute the VM
void vm_execute(VirtualMachine* vm) {
    while (vm->running && vm->pc < vm->code_size) {
        uint8_t opcode = vm->memory[vm->pc++];
        uint8_t reg1, reg2, reg3;
        uint32_t imm_value, addr;
        
        switch (opcode) {
            case OP_HALT:
                vm->running = 0;
                break;
                
            case OP_LOAD:
                reg1 = vm->memory[vm->pc++];
                imm_value = (vm->memory[vm->pc] << 24) | 
                           (vm->memory[vm->pc+1] << 16) | 
                           (vm->memory[vm->pc+2] << 8) | 
                           vm->memory[vm->pc+3];
                vm->pc += 4;
                vm->registers[reg1] = imm_value;
                break;
                
            case OP_MOVE:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2];
                break;
                
            case OP_ADD:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] + vm->registers[reg3];
                break;
                
            case OP_SUB:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] - vm->registers[reg3];
                break;
                
            case OP_MUL:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] * vm->registers[reg3];
                break;
                
            case OP_XOR:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] ^ vm->registers[reg3];
                break;
                
            case OP_AND:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] & vm->registers[reg3];
                break;
                
            case OP_OR:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] | vm->registers[reg3];
                break;
                
            case OP_NOT:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                vm->registers[reg1] = ~vm->registers[reg2];
                break;
                
            case OP_LOAD_MEM:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->memory[vm->registers[reg2] % VM_MEMORY_SIZE];
                break;
                
            case OP_STORE_MEM:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                vm->memory[vm->registers[reg2] % VM_MEMORY_SIZE] = vm->registers[reg1] & 0xFF;
                break;
                
            case OP_JMP:
                addr = (vm->memory[vm->pc] << 8) | vm->memory[vm->pc+1];
                vm->pc = addr;
                break;
                
            case OP_JZ:
                addr = (vm->memory[vm->pc] << 8) | vm->memory[vm->pc+1];
                vm->pc += 2;
                if (vm->zero_flag) {
                    vm->pc = addr;
                }
                break;
                
            case OP_JNZ:
                addr = (vm->memory[vm->pc] << 8) | vm->memory[vm->pc+1];
                vm->pc += 2;
                if (!vm->zero_flag) {
                    vm->pc = addr;
                }
                break;
                
            case OP_CMP:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                vm->zero_flag = (vm->registers[reg1] == vm->registers[reg2]);
                break;
                
            case OP_PUSH:
                reg1 = vm->memory[vm->pc++];
                if (vm->sp < VM_STACK_SIZE) {
                    vm->stack[vm->sp++] = vm->registers[reg1];
                } else {
                    printf("Stack overflow!\n");
                    vm->running = 0;
                }
                break;
                
            case OP_POP:
                reg1 = vm->memory[vm->pc++];
                if (vm->sp > 0) {
                    vm->registers[reg1] = vm->stack[--vm->sp];
                } else {
                    printf("Stack underflow!\n");
                    vm->running = 0;
                }
                break;
                
            case OP_CALL:
                addr = (vm->memory[vm->pc] << 8) | vm->memory[vm->pc+1];
                vm->pc += 2;
                if (vm->sp < VM_STACK_SIZE) {
                    vm->stack[vm->sp++] = vm->pc;
                    vm->pc = addr;
                } else {
                    printf("Stack overflow in CALL!\n");
                    vm->running = 0;
                }
                break;
                
            case OP_RET:
                if (vm->sp > 0) {
                    vm->pc = vm->stack[--vm->sp];
                } else {
                    printf("Stack underflow in RET!\n");
                    vm->running = 0;
                }
                break;
                
            case OP_RANDOM:
                reg1 = vm->memory[vm->pc++];
                vm->registers[reg1] = rand() & 0xFF;
                break;
                
            case OP_SHIFT_L:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] << (vm->registers[reg3] & 0x1F);
                break;
                
            case OP_SHIFT_R:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                vm->registers[reg1] = vm->registers[reg2] >> (vm->registers[reg3] & 0x1F);
                break;
                
            case OP_ROT_L:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                uint32_t value = vm->registers[reg2];
                uint32_t shift = vm->registers[reg3] & 0x1F;
                vm->registers[reg1] = (value << shift) | (value >> (32 - shift));
                break;
                
            case OP_ROT_R:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                uint32_t val = vm->registers[reg2];
                uint32_t sft = vm->registers[reg3] & 0x1F;
                vm->registers[reg1] = (val >> sft) | (val << (32 - sft));
                break;
                
            case OP_MOD:
                reg1 = vm->memory[vm->pc++];
                reg2 = vm->memory[vm->pc++];
                reg3 = vm->memory[vm->pc++];
                if (vm->registers[reg3] != 0) {
                    vm->registers[reg1] = vm->registers[reg2] % vm->registers[reg3];
                } else {
                    printf("Division by zero in MOD!\n");
                    vm->running = 0;
                }
                break;
                
            default:
                printf("Unknown opcode: 0x%02X at position 0x%04X\n", opcode, vm->pc-1);
                vm->running = 0;
                break;
        }
    }
}

// Obfuscated bytecode for password verification
// This implements a custom algorithm that checks if the input matches the flag
uint8_t password_checker[] = {
    // Initialize registers
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00,  // Load 0 into R0 (index)
    0x01, 0x01, 0x00, 0x00, 0x00, 0x01,  // Load 1 into R1 (counter)
    0x01, 0x02, 0x00, 0x00, 0x00, 0x00,  // Load 0 into R2 (result)
    0x01, 0x03, 0x00, 0x00, 0x01, 0x28,  // Load 0x128 (296) into R3 (memory address for input)
    0x01, 0x04, 0x00, 0x00, 0x02, 0x00,  // Load 0x200 (512) into R4 (memory address for key)
    0x01, 0x05, 0x00, 0x00, 0x00, 0x24,  // Load 36 into R5 (length)
    
    // Load verification key into memory (obfuscated flag)
    // This is pre-computed from the flag using the algorithm
    0x01, 0x0F, 0x00, 0x00, 0x00, 0xAE,  // Key byte 0
    0x0C, 0x0F, 0x04, // Store to memory
    0x03, 0x04, 0x04, 0x01, // Increment address
    
    0x01, 0x0F, 0x00, 0x00, 0x00, 0x8F,  // Key byte 1
    0x0C, 0x0F, 0x04, // Store to memory
    0x03, 0x04, 0x04, 0x01, // Increment address
    
    0x01, 0x0F, 0x00, 0x00, 0x00, 0xC2,  // Key byte 2
    0x0C, 0x0F, 0x04, // Store to memory
    0x03, 0x04, 0x04, 0x01, // Increment address
    
    0x01, 0x0F, 0x00, 0x00, 0x00, 0xB3,  // Key byte 3
    0x0C, 0x0F, 0x04, // Store to memory
    0x03, 0x04, 0x04, 0x01, // Increment address
    
    // ... more key bytes would be here, but abbreviated to keep code shorter
    // In a real challenge, you'd have the complete key for the whole flag
    
    // Main verification loop
    // Loop start
    0x01, 0x06, 0x00, 0x00, 0x00, 0x00,  // Load 0 into R6 (temp)
    
    // Load input character
    0x02, 0x06, 0x03, // Move memory address to R6
    0x03, 0x06, 0x06, 0x00, // Add index to address
    0x0B, 0x07, 0x06, // Load from memory[R6] to R7
    
    // Load key character
    0x02, 0x06, 0x04, // Move key address to R6
    0x03, 0x06, 0x06, 0x00, // Add index to address
    0x0B, 0x08, 0x06, // Load from memory[R6] to R8
    
    // Custom transformation of input character
    0x01, 0x09, 0x00, 0x00, 0x00, 0x41,  // Load 0x41 (magic value) into R9
    0x03, 0x0A, 0x07, 0x09, // R10 = character + magic
    0x18, 0x0B, 0x0A, 0x01, // R11 = rotate left R10 by 1
    0x07, 0x0B, 0x0B, 0x09, // R11 = R11 XOR magic
    0x1A, 0x0C, 0x0B, 0x09, // R12 = R11 % magic
    0x19, 0x0D, 0x0C, 0x01, // R13 = rotate right R12 by 1
    
    // Compare transformed input with key
    0x14, 0x0D, 0x08, // Compare R13 with R8
    0x0E, 0x00, 0xB4, // Jump to failure if not equal (to address 0xB4)
    
    // Increment counter and index
    0x03, 0x00, 0x00, 0x01, // Increment index
    
    // Check if we've processed all characters
    0x14, 0x00, 0x05, // Compare index with length
    0x0E, 0x00, 0xC8, // Jump to success if equal (to address 0xC8)
    
    // Loop back
    0x0D, 0x00, 0x60, // Jump back to loop start (to address 0x60)
    
    // Failure path
    0x01, 0x0E, 0x00, 0x00, 0x00, 0x00, // Load 0 into R14 (failure)
    0x0D, 0x00, 0xD2, // Jump to end (to address 0xD2)
    
    // Success path
    0x01, 0x0E, 0x00, 0x00, 0x00, 0x01, // Load 1 into R14 (success)
    
    // End
    0x00 // HALT
};

int main() {
    VirtualMachine vm;
    char input[100];
    
    printf("=== Obfuscated VM Challenge ===\n");
    printf("Enter password: ");
    fgets(input, sizeof(input), stdin);
    
    // Remove newline
    size_t len = strlen(input);
    if (len > 0 && input[len-1] == '\n') {
        input[len-1] = '\0';
        len--;
    }
    
    // Initialize VM
    vm_init(&vm);
    
    // Copy input to VM memory
    for (size_t i = 0; i < len; i++) {
        vm.memory[0x128 + i] = input[i];
    }
    
    // Load and execute verification bytecode
    vm_load_bytecode(&vm, password_checker, sizeof(password_checker));
    vm_execute(&vm);
    
    // Check result
    if (vm.registers[0x0E] == 1) {
        printf("Correct! The flag is: flag{v1rtu4l1z3d_0bfusc4t10n_1s_h4rd_t0_cr4ck}\n");
    } else {
        printf("Incorrect password. Try again.\n");
    }
    
    return 0;
} 