type Local<T> = Omit<T, 'id'>

type Message = {
    id: string,
    creator: string,
    channel: string,
    content: MessageContent,
}

type MessageContent = string

type Channel = {
    id: string,
    title: string,
}
