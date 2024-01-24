import PocketBase, { type AuthModel, type RecordAuthResponse, type RecordModel, type RecordSubscription, type UnsubscribeFunc } from 'pocketbase';
import { loggedUser } from '../stores/mainStores';
import { get } from 'svelte/store';

export const pb = new PocketBase(`http://ssh.spaupa-file.com:3950`);

function processChannnelRecord(record: any): Channel {
    const {
        id, 
        title, 
        type
    } = record
    return {
        id,
        title,
        type: type || 'talkRoom'
    }
}

function processUserRecord(record: any) {
    return record as User
}

export async function getAllChannels(): Promise<Channel[]> {
    const records = await pb.collection('channels').getFullList({});
    return records.map(processChannnelRecord)
}

export async function getChannels(channelIds: string[]): Promise<Channel[]> {
    const col = pb.collection('channels')
    return Promise.all(channelIds.map(async channelId => {
        return processChannnelRecord(await col.getOne(channelId))
    }))
}

export async function getUser(userId: string) {
    return await processUserRecord(pb.collection('users').getOne(userId))
}

export async function getMessagesFromChannel(channelId: string): Promise<Message[]> {
    const records = await pb.collection('messages').getList<
        RecordModel & Message
    >(1, 20, {
        filter: `channel = '${channelId}'`
    }) // TODO: Handle paging

    return records.items;
}

export async function userJoinChannel(user: User, channelId: string) {
    const {
        id, joinedChannels
    } = user
    await pb.collection('users').update(id, {
        joinedChannels: joinedChannels.concat([channelId])
    })
}

export async function createChannel(channel: Local<Channel>): Promise<Channel> {
    const record = await pb.collection('channels').create(
        channel
    )
    return record as any as Channel
}

export async function createMessageToChannel(message: Local<Message>): Promise<void> {
    await pb.collection('messages').create(
        {
            ...message,
            creator: get(loggedUser)!.id
        }
    )
}

export async function subscribeToChannel(
    channelId: string, 
    callback: (data: RecordSubscription<Message>) => void
): Promise<() => Promise<void>> {
    return await pb.collection('messages').subscribe<Message>('*', (e) => {
        console.dir(e)
        console.log(e.record.channel, channelId)
        if (e.record.channel == channelId) {
            callback(e)
        }
    })
}

export async function login(username: string, password: string): Promise<RecordAuthResponse<RecordModel>> {
    try {
        const res = await pb.collection('users').authWithPassword(username, password)
        loggedUser.set(pb.authStore.model as User);
        return res;
    } catch (e) {
        //console.dir(e)
        throw e;
    }
}

export async function register(
    username: string, 
    email: string, 
    password: string, 
    passwordConfirm: string,
): Promise<RecordModel> {
    try {
        return await pb.collection('users').create(
            {
                username,
                email,
                password,
                passwordConfirm,
            }
        )
    } catch (e) {
        //console.dir(e)
        throw e;
    }
}

export async function updateLoggedUser(): Promise<User | null> {
    if (pb.authStore.isValid)
        await pb.collection('users').authRefresh();

    let ret;
    if (pb.authStore.model)
        ret = pb.authStore.model as User
    else
        ret = null
    
    loggedUser.set(ret);
    return ret;
}

export function logout() {
    pb.authStore.clear()
    loggedUser.set(null);
}
