type LocalMessage = {
    id: string,
    fromSelf: boolean,
    content: MessageContent,
}

type MessageContent = string

type Channel = {
    title: string,
    messages: LocalMessage[],
}
