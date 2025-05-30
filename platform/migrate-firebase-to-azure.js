import "dotenv/config"

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const FIREBASE_SERVICE_ACCOUNT = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
const CTFD_ACCESS_TOKEN = process.env.CTFD_ACCESS_TOKEN
const CTFD_API_URL = process.env.CTFD_API_URL

export const app = initializeApp({ credential: cert(FIREBASE_SERVICE_ACCOUNT) })
export const db = getFirestore()

const membersCol = db.collection("members")
const teamsCol = db.collection("teams")

/**
 * @param {string} path
 * @param {string} method
 * @param {Record<string, any>|null} body
 */
export async function fetchCtfdApi(path, method, body=null) {
    const headers = {
        "Accept": "application/json",
        "Authorization": `Token ${CTFD_ACCESS_TOKEN}`,
    }

    if (body != null) {
        headers["Content-Type"] = "application/json" 
        body = JSON.stringify(body)
    }

    const res = await fetch(`${CTFD_API_URL}/${path}`, {
        method,  
        headers,
        body,
    })

    if (!res.ok) {
        return [false, null]
    }

    const json = await res.json()

    if (!json.success) {
        return [false, null]
    }

    return [true, json]
}

/**
 * @param {import("firebase-admin/firestore").DocumentSnapshot<import("firebase-admin/firestore").DocumentData>} team
 * @param {import("firebase-admin/firestore").DocumentSnapshot<import("firebase-admin/firestore").DocumentData>} member
 */
async function migrateMember(team, member) {
    if (!member.exists) {
        console.log(`skipping member ${member.id}`)
        return
    }

    const memRes = await fetch(`${CTFD_API_URL}/users`, {
        method: "POST",  
        headers: {
            "Accept": "application/json",
            "Authorization": `Token ${CTFD_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: `${team.get("name")}::${member.get("name")}`,
            email: member.get("email"),
            password: team.get("password"),
            type: "user",
            verified: false,
            hidden: false,
            banned: false,
            fields: []
        })
    })

    if (!memRes.ok) {
        console.error(`could not create member ${member.get("name")}`)
        console.log(await memRes.text())
        return
    }

    const json = await memRes.json()

    if (!json.success) {
        console.error(`could not create team ${member.get("name")}`)
        console.log(json)
        return
    }

    console.log(`created member ${member.get("name")} successfully`)
}

/**
 * @param {import("firebase-admin/firestore").DocumentSnapshot<import("firebase-admin/firestore").DocumentData>} team
 */
async function migrateTeam(team) {
    const leader = await membersCol.doc(team.get("leader")).get()

    const teamRes = await fetch(`${CTFD_API_URL}/teams`, {
        method: "POST",  
        headers: {
            "Accept": "application/json",
            "Authorization": `Token ${CTFD_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: team.get("name"),
            email: leader.get("email"),
            password: team.get("password"),
            banned: false,
            hidden: false,
            fields: [],
        })
    })

    if (!teamRes.ok) {
        console.error(`could not create team ${team.get("name")}`)
        console.log(await teamRes.text())
        return
    }

    const json = await teamRes.json()

    if (!json.success) {
        console.error(`could not create team ${team.get("name")}`)
        console.log(json)
        return
    }

    for (const member of team.get("members")) {
        await migrateMember(team, await membersCol.doc(member).get())
    }

    console.log(`created team ${team.get("name")} successfully`)
}

teamsCol.listDocuments().then((ts) => ts.forEach(t => t.get().then(migrateTeam)))
