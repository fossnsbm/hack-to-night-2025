const parts = [
    {
        id: 1,
        title: "Team Details",
        required: true,
        fields: [
            { label: "Team Name", name: "teamName" },
            { label: "University Name", name: "universityName" },
        ],
    },
    {
        id: 2,
        title: "Team Leader",
        required: true,
        fields: [
            { label: "Name", name: "leaderName" },
            { label: "Whatsapp", name: "leaderWhatsapp" },
            { label: "Email", name: "leaderEmail" },
            { label: "NIC", name: "leaderNic" },
        ],
    },
    {
        id: 3,
        title: "Member 1",
        required: true,
        fields: [
            { label: "Name", name: "member1Name" },
            { label: "Whatsapp", name: "member1Whatsapp" },
            { label: "Email", name: "member1Email" },
            { label: "NIC", name: "member1Nic" },
        ],
    },
    {
        id: 4,
        title: "Member 2 (Optional)",
        required: false,
        fields: [
            { label: "Name", name: "member2Name" },
            { label: "Whatsapp", name: "member2Whatsapp" },
            { label: "Email", name: "member2Email" },
            { label: "NIC", name: "member2Nic" },
        ],
    },
    {
        id: 5,
        title: "Member 3 (Optional)",
        required: false,
        fields: [
            { label: "Name", name: "member3Name" },
            { label: "Whatsapp", name: "member3Whatsapp" },
            { label: "Email", name: "member3Email" },
            { label: "NIC", name: "member3Nic" },
        ],
    },
];

export default parts;
