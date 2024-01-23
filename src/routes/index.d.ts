type LocalMessage = {
    id: string,
    fromSelf: boolean,
    channelId: string,
    content: MessageContent,
}

type MessageContent = string

type Channel = {
    id: string,
    title: string,
    messages: LocalMessage[],
}
