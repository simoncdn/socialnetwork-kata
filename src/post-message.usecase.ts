export type PostMessageCommand = {
	id: string;
	author: string;
	content: string;
};

export type Message = {
	id: string;
	author: string;
	content: string;
	publishedAt: Date;
};

export interface MessageRepository {
	save(message: Message): Promise<void>;
}

export interface DateProvider {
	getPublishedDate(): Date;
}
export class MessageTooLongError extends Error { }
export class EmptyMessageError extends Error { }

export class PostMessageUseCase {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly dateProvider: DateProvider
	) { }

	async handle(postMessageCommand: PostMessageCommand) {
		if (postMessageCommand.content.length > 280) {
			throw new MessageTooLongError();
		} else if (postMessageCommand.content.trim().length === 0) {
			throw new EmptyMessageError();
		}
		await this.messageRepository.save({
			id: postMessageCommand.id,
			author: postMessageCommand.author,
			content: postMessageCommand.content,
			publishedAt: this.dateProvider.getPublishedDate(),
		});
	}
}
