type Local<T> = Omit<Omit<T, 'id'>, 'creator'>

type Message = {
    id: string,
    creator: string,
    channel: string,
    content: MessageContent,
}

type MessageContent = string

type ChannelType = 'talkRoom' | 'board'

type Channel = {
    id: string,
    title: string,
    type: ChannelType
}

type User = {
    id: string,
    username: string,
    email: string,
    joinedChannels: string[],
}
