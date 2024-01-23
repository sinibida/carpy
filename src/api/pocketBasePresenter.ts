import PocketBase, { type RecordModel } from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

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
        message
    )
}
