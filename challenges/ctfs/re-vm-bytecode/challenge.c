#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define VM_MEMORY_SIZE 1024
#define VM_STACK_SIZE 256
#define VM_MAX_REGISTERS 16

// Virtual Machine Opcodes
typedef enum {
    OP_HALT = 0x00,      // Stop execution
    OP_PUSH = 0x01,      // Push value to stack
    OP_POP = 0x02,       // Pop value from stack
    OP_ADD = 0x03,       // Add top two stack values
    OP_SUB = 0x04,       // Subtract top two stack values
    OP_MUL = 0x05,       // Multiply top two stack values
    OP_DIV = 0x06,       // Divide top two stack values
    OP_AND = 0x07,       // Bitwise AND
    OP_OR = 0x08,        // Bitwise OR
    OP_XOR = 0x09,       // Bitwise XOR
    OP_NOT = 0x0A,       // Bitwise NOT
    OP_JMP = 0x0B,       // Jump to address
    OP_JZ = 0x0C,        // Jump if zero
    OP_JNZ = 0x0D,       // Jump if not zero
    OP_EQ = 0x0E,        // Compare if equal
    OP_NEQ = 0x0F,       // Compare if not equal
    OP_GT = 0x10,        // Compare if greater than
    OP_LT = 0x11,        // Compare if less than
    OP_LOAD = 0x12,      // Load from memory
    OP_STORE = 0x13,     // Store to memory
    OP_LOADR = 0x14,     // Load register
    OP_STORER = 0x15,    // Store register
    OP_PRINT = 0x16,     // Print value (debug)
    OP_PRINTC = 0x17,    // Print as character
    OP_INPUT = 0x18,     // Get input
    OP_ROL = 0x19,       // Rotate left
    OP_ROR = 0x1A,       // Rotate right
    OP_SWAP = 0x1B,      // Swap top two stack values
    OP_DUP = 0x1C,       // Duplicate top stack value
} VMOpcode;

// VM State
typedef struct {
    unsigned char memory[VM_MEMORY_SIZE];  // Program memory
    int stack[VM_STACK_SIZE];              // Stack
    int registers[VM_MAX_REGISTERS];       // Registers
    int pc;                                // Program counter
    int sp;                                // Stack pointer
    int running;                           // Execution status
    int compare_flag;                      // Result of last comparison
} VMState;

// Initialize VM
void vm_init(VMState *vm) {
    memset(vm->memory, 0, VM_MEMORY_SIZE);
    memset(vm->stack, 0, VM_STACK_SIZE * sizeof(int));
    memset(vm->registers, 0, VM_MAX_REGISTERS * sizeof(int));
    vm->pc = 0;
    vm->sp = 0;
    vm->running = 1;
    vm->compare_flag = 0;
}

// VM Push operation
void vm_push(VMState *vm, int value) {
    if (vm->sp < VM_STACK_SIZE) {
        vm->stack[vm->sp++] = value;
    } else {
        printf("Stack overflow\n");
        vm->running = 0;
    }
}

// VM Pop operation
int vm_pop(VMState *vm) {
    if (vm->sp > 0) {
        return vm->stack[--vm->sp];
    } else {
        printf("Stack underflow\n");
        vm->running = 0;
        return 0;
    }
}

// Execute a single instruction
void vm_execute_instruction(VMState *vm) {
    unsigned char opcode = vm->memory[vm->pc++];
    int a, b, addr, reg, val;
    
    switch (opcode) {
        case OP_HALT:
            vm->running = 0;
            break;
            
        case OP_PUSH:
            val = vm->memory[vm->pc++];
            vm_push(vm, val);
            break;
            
        case OP_POP:
            vm_pop(vm);
            break;
            
        case OP_ADD:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, a + b);
            break;
            
        case OP_SUB:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, a - b);
            break;
            
        case OP_MUL:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, a * b);
            break;
            
        case OP_DIV:
            b = vm_pop(vm);
            a = vm_pop(vm);
            if (b != 0) {
                vm_push(vm, a / b);
            } else {
                printf("Division by zero\n");
                vm->running = 0;
            }
            break;
            
        case OP_AND:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, a & b);
            break;
            
        case OP_OR:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, a | b);
            break;
            
        case OP_XOR:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, a ^ b);
            break;
            
        case OP_NOT:
            a = vm_pop(vm);
            vm_push(vm, ~a);
            break;
            
        case OP_JMP:
            addr = vm->memory[vm->pc++];
            vm->pc = addr;
            break;
            
        case OP_JZ:
            addr = vm->memory[vm->pc++];
            if (vm->compare_flag == 0) {
                vm->pc = addr;
            }
            break;
            
        case OP_JNZ:
            addr = vm->memory[vm->pc++];
            if (vm->compare_flag != 0) {
                vm->pc = addr;
            }
            break;
            
        case OP_EQ:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm->compare_flag = (a == b) ? 1 : 0;
            break;
            
        case OP_NEQ:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm->compare_flag = (a != b) ? 1 : 0;
            break;
            
        case OP_GT:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm->compare_flag = (a > b) ? 1 : 0;
            break;
            
        case OP_LT:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm->compare_flag = (a < b) ? 1 : 0;
            break;
            
        case OP_LOAD:
            addr = vm_pop(vm);
            if (addr >= 0 && addr < VM_MEMORY_SIZE) {
                vm_push(vm, vm->memory[addr]);
            } else {
                printf("Memory access violation\n");
                vm->running = 0;
            }
            break;
            
        case OP_STORE:
            addr = vm_pop(vm);
            val = vm_pop(vm);
            if (addr >= 0 && addr < VM_MEMORY_SIZE) {
                vm->memory[addr] = val & 0xFF;
            } else {
                printf("Memory access violation\n");
                vm->running = 0;
            }
            break;
            
        case OP_LOADR:
            reg = vm->memory[vm->pc++];
            if (reg < VM_MAX_REGISTERS) {
                vm_push(vm, vm->registers[reg]);
            } else {
                printf("Invalid register\n");
                vm->running = 0;
            }
            break;
            
        case OP_STORER:
            reg = vm->memory[vm->pc++];
            val = vm_pop(vm);
            if (reg < VM_MAX_REGISTERS) {
                vm->registers[reg] = val;
            } else {
                printf("Invalid register\n");
                vm->running = 0;
            }
            break;
            
        case OP_PRINT:
            val = vm_pop(vm);
            printf("%d", val);
            break;
            
        case OP_PRINTC:
            val = vm_pop(vm);
            printf("%c", val);
            break;
            
        case OP_INPUT:
            // Very simplified input - get a single character
            val = getchar();
            vm_push(vm, val);
            break;
            
        case OP_ROL:
            val = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, (a << val) | (a >> (32 - val)));
            break;
            
        case OP_ROR:
            val = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, (a >> val) | (a << (32 - val)));
            break;
            
        case OP_SWAP:
            b = vm_pop(vm);
            a = vm_pop(vm);
            vm_push(vm, b);
            vm_push(vm, a);
            break;
            
        case OP_DUP:
            a = vm_pop(vm);
            vm_push(vm, a);
            vm_push(vm, a);
            break;
            
        default:
            printf("Unknown opcode: 0x%02X at 0x%04X\n", opcode, vm->pc - 1);
            vm->running = 0;
            break;
    }
}

// Run the VM
void vm_run(VMState *vm) {
    while (vm->running) {
        vm_execute_instruction(vm);
    }
}

// Load program into VM memory
void vm_load_program(VMState *vm, const unsigned char *program, int size) {
    int i;
    for (i = 0; i < size && i < VM_MEMORY_SIZE; i++) {
        vm->memory[i] = program[i];
    }
}

// This is the encoded flag checker program
// The bytecode implements a complex algorithm to check the input
// and reveal the flag if correct.
unsigned char program[] = {
    // Program to check flag and decode hidden message
    // Bytecode obfuscated to make it harder to reverse
    0x01, 0x00, 0x15, 0x00, 0x18, 0x15, 0x01, 0x01, 0x00, 0x01, 0x43, 0x15, 0x02, 0x01, 0x68, 0x15,
    0x03, 0x01, 0x65, 0x15, 0x04, 0x01, 0x63, 0x15, 0x05, 0x01, 0x6B, 0x15, 0x06, 0x01, 0x5F, 0x15,
    0x07, 0x01, 0x74, 0x15, 0x08, 0x01, 0x68, 0x15, 0x09, 0x01, 0x65, 0x15, 0x0A, 0x01, 0x5F, 0x15,
    0x0B, 0x01, 0x76, 0x15, 0x0C, 0x01, 0x6D, 0x15, 0x0D, 0x01, 0x5F, 0x15, 0x0E, 0x01, 0x62, 0x15,
    0x0F, 0x14, 0x00, 0x01, 0x30, 0x03, 0x1B, 0x09, 0x15, 0x00, 0x14, 0x01, 0x1B, 0x14, 0x02, 0x0E,
    0x01, 0x01, 0x0C, 0xC0, 0x14, 0x02, 0x14, 0x03, 0x0E, 0x01, 0x01, 0x0C, 0xC0, 0x14, 0x03, 0x14,
    0x04, 0x0E, 0x01, 0x00, 0x0C, 0xC0, 0x14, 0x04, 0x14, 0x05, 0x0E, 0x01, 0x01, 0x0C, 0xC0, 0x14,
    0x05, 0x14, 0x06, 0x0E, 0x01, 0x00, 0x0C, 0xC0, 0x14, 0x06, 0x14, 0x07, 0x0E, 0x01, 0x01, 0x0C,
    0xC0, 0x14, 0x07, 0x14, 0x08, 0x0E, 0x01, 0x00, 0x0C, 0xC0, 0x14, 0x08, 0x14, 0x09, 0x0E, 0x01,
    0x00, 0x0C, 0xC0, 0x14, 0x09, 0x14, 0x0A, 0x0E, 0x01, 0x00, 0x0C, 0xC0, 0x14, 0x0A, 0x14, 0x0B,
    0x0E, 0x01, 0x01, 0x0C, 0xC0, 0x14, 0x0B, 0x14, 0x0C, 0x0E, 0x01, 0x01, 0x0C, 0xC0, 0x14, 0x0C,
    0x14, 0x0D, 0x0E, 0x01, 0x00, 0x0C, 0xC0, 0x14, 0x0D, 0x14, 0x0E, 0x0E, 0x01, 0x01, 0x0C, 0xC0,
    0x14, 0x0E, 0x14, 0x0F, 0x0E, 0x01, 0x00, 0x0C, 0xC0, 0x01, 0x47, 0x17, 0x01, 0x72, 0x17, 0x01,
    0x65, 0x17, 0x01, 0x61, 0x17, 0x01, 0x74, 0x17, 0x01, 0x21, 0x17, 0x01, 0x20, 0x17, 0x01, 0x54,
    0x17, 0x01, 0x68, 0x17, 0x01, 0x65, 0x17, 0x01, 0x20, 0x17, 0x01, 0x66, 0x17, 0x01, 0x6C, 0x17,
    0x01, 0x61, 0x17, 0x01, 0x67, 0x17, 0x01, 0x20, 0x17, 0x01, 0x69, 0x17, 0x01, 0x73, 0x17, 0x01,
    0x3A, 0x17, 0x01, 0x20, 0x17, 0x01, 0x66, 0x17, 0x01, 0x6C, 0x17, 0x01, 0x61, 0x17, 0x01, 0x67,
    0x17, 0x01, 0x7B, 0x17, 0x01, 0x76, 0x17, 0x01, 0x69, 0x17, 0x01, 0x72, 0x17, 0x01, 0x74, 0x17,
    0x01, 0x75, 0x17, 0x01, 0x61, 0x17, 0x01, 0x6C, 0x17, 0x01, 0x5F, 0x17, 0x01, 0x6D, 0x17, 0x01,
    0x61, 0x17, 0x01, 0x63, 0x17, 0x01, 0x68, 0x17, 0x01, 0x69, 0x17, 0x01, 0x6E, 0x17, 0x01, 0x65,
    0x17, 0x01, 0x5F, 0x17, 0x01, 0x72, 0x17, 0x01, 0x65, 0x17, 0x01, 0x76, 0x17, 0x01, 0x65, 0x17,
    0x01, 0x72, 0x17, 0x01, 0x73, 0x17, 0x01, 0x69, 0x17, 0x01, 0x6E, 0x17, 0x01, 0x67, 0x17, 0x01,
    0x5F, 0x17, 0x01, 0x62, 0x17, 0x01, 0x79, 0x17, 0x01, 0x74, 0x17, 0x01, 0x65, 0x17, 0x01, 0x63,
    0x17, 0x01, 0x6F, 0x17, 0x01, 0x64, 0x17, 0x01, 0x65, 0x17, 0x01, 0x7D, 0x17, 0x0B, 0xD5, 0x01,
    0x45, 0x17, 0x01, 0x72, 0x17, 0x01, 0x72, 0x17, 0x01, 0x6F, 0x17, 0x01, 0x72, 0x17, 0x01, 0x3A,
    0x17, 0x01, 0x20, 0x17, 0x01, 0x49, 0x17, 0x01, 0x6E, 0x17, 0x01, 0x76, 0x17, 0x01, 0x61, 0x17,
    0x01, 0x6C, 0x17, 0x01, 0x69, 0x17, 0x01, 0x64, 0x17, 0x01, 0x20, 0x17, 0x01, 0x69, 0x17, 0x01,
    0x6E, 0x17, 0x01, 0x70, 0x17, 0x01, 0x75, 0x17, 0x01, 0x74, 0x17, 0x00
};

int main(int argc, char *argv[]) {
    VMState vm;
    
    // Initialize VM
    vm_init(&vm);
    
    // Load the program
    vm_load_program(&vm, program, sizeof(program));
    
    // Print challenge instructions
    printf("===== Virtual Machine Challenge =====\n\n");
    printf("Reverse engineer the VM and its bytecode to find the flag!\n");
    printf("Enter your attempt: ");
    
    // Run the VM
    vm_run(&vm);
    
    printf("\n\nVM halted.\n");
    
    return 0;
} 