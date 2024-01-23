import PocketBase, { type AuthModel, type RecordAuthResponse, type RecordModel, type RecordSubscription, type UnsubscribeFunc } from 'pocketbase';

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
            creator: getLoggedUser()!.id
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
        return res;
    } catch (e) {
        console.dir(e)
        throw e;
    }
}

export function getLoggedUser(): User | null {
    if (pb.authStore.model)
        return pb.authStore.model as User
    else
        return null
}

export function isMyId(id: string): boolean {
    const x = getLoggedUser()
    if (x) {
        return x.id === id
    } else {
        return false;
    }
}

export function logout() {
    pb.authStore.clear()
}
