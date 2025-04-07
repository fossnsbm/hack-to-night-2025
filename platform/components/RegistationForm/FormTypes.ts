import { z } from "zod";

const phoneNumberRegex = /^(?:7|0|(?:\+94))[0-9]{9,10}$/;
const nicRegex = /^(?:19|20)?\d{2}[0-9]{10}|[0-9]{9}[x|X|v|V]$/;
const nameSchema = z.string().trim().min(2).max(24);
const emailSchema = z.string().trim().email().min(6);
const whatsappSchema = z.string().trim().regex(phoneNumberRegex);
const nicSchema = z.string().trim().regex(nicRegex);

export const formSchema = z.object({
    teamName: z.string().trim().min(2).max(16),
    universityName: z.string().trim().min(2).max(24),
    leaderName: nameSchema,
    leaderWhatsapp: whatsappSchema,
    leaderEmail: emailSchema,
    leaderNic: nicSchema,
    member1Name: nameSchema,
    member1Whatsapp: whatsappSchema,
    member1Email: emailSchema,
    member1Nic: nicSchema,
    member2Name: nameSchema.optional(),
    member2Whatsapp: whatsappSchema.optional(),
    member2Email: emailSchema.optional(),
    member2Nic: nicSchema.optional(),
    member3Name: nameSchema.optional(),
    member3Whatsapp: whatsappSchema.optional(),
    member3Email: emailSchema.optional(),
    member3Nic: nicSchema.optional(),
});

export type Form = z.infer<typeof formSchema>;
