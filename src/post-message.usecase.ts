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
export class PostMessageUseCase {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly publishedDate: DateProvider
	) { }

	handle(postMessageCommand: PostMessageCommand) {
		this.messageRepository.save({
			id: postMessageCommand.id,
			authorId: postMessageCommand.authorId,
			content: postMessageCommand.content,
			publishedAt: this.publishedDate.getPublishedDate(),
		});
	}
}
