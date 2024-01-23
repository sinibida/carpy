import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

export async function getAllChannels(): Promise<Channel[]> {
    const records = await pb.collection('channels').getFullList({});
    return records.map(({id, title}) => ({
        id,
        title,
        messages: []
    }))
}

export async function getMessagesFromChannel(channelId: string): Promise<LocalMessage[]> {
    const records = await pb.collection('messages').getList(1, 20, {
        filter: `channel = '${channelId}'`
    })

    return records.items.map(({
        id,
        content,
        channelId,
    }) => ({
        id,
        content,
        channelId,
        fromSelf: true,
    }))
}
