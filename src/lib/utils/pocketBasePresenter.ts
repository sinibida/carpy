import PocketBase, { type AuthModel, type RecordAuthResponse, type RecordModel, type RecordSubscription, type UnsubscribeFunc } from 'pocketbase';
import { loggedUser } from '../../stores/mainStores';
import { get } from 'svelte/store';

export const pb = new PocketBase(`http://127.0.0.1:8090`);

export async function getAllChannels(): Promise<Channel[]> {
    const records = await pb.collection('channels').getFullList({});
    return records.map(({id, title}) => ({
        id,
        title,
        messages: []
    }))
}

export async function getMessagesFromChannel(channelId: string): Promise<Message[]> {
    const records = await pb.collection('messages').getList<
        RecordModel & Message
    >(1, 20, {
        filter: `channel = '${channelId}'`
    })

    return records.items;
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
    console.log('login:', username, password)
    import.meta.env
    try {
        const res = await pb.collection('users').authWithPassword(username, password)
        console.log('login complete:', res);
        loggedUser.set(pb.authStore.model as User);
        return res;
    } catch (e) {
        console.dir(e)
        throw e;
    }
}

export function updateLoggedUser(): User | null {
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
