export type PostMessageCommand = {
	id: string;
	authorId: string;
	content: string;
};

export type Message = {
	id: string;
	authorId: string;
	content: string;
	publishedAt: Date;
};

export interface MessageRepository {
	save(message: Message): void;
}

export interface DateProvider {
	getPublishedDate(): Date;
}
export class MessageTooLongError extends Error { }
export class EmptyMessageError extends Error { }

export class PostMessageUseCase {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly publishedDate: DateProvider
	) { }

	handle(postMessageCommand: PostMessageCommand) {
		if (postMessageCommand.content.length > 280) {
			throw new MessageTooLongError();
		} else if (postMessageCommand.content.trim().length === 0) {
			throw new EmptyMessageError();
		}
		this.messageRepository.save({
			id: postMessageCommand.id,
			authorId: postMessageCommand.authorId,
			content: postMessageCommand.content,
			publishedAt: this.publishedDate.getPublishedDate(),
		});
	}
}
