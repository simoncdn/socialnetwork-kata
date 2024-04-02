import { PostMessageCommand } from "../post-message.usecase";
import { DateProvider } from "../post-message.usecase";
import { MessageRepository } from "../post-message.usecase";
import { Message } from "../post-message.usecase";
import { PostMessageUseCase } from "../post-message.usecase";

describe("Feature: Posting a message", () => {
	describe("Rule: A message can contain a maximum of 280 characters", () => {
		test("Alice can post a message on her timeline", () => {
			givenNowIs(new Date("2024-01-19T19:00:00Z"));

			whenUserPostsAMessage({
				id: "message-id",
				authorId: "Alice",
				content: "Hello World!",
			})

			thenPostedMessageShouldBe({
				id: "message-id",
				authorId: "Alice",
				content: "Hello World!",
				publishedAt: new Date("2024-01-19T19:00:00Z"),
			})
		})
	});
});
let message: Message;

class InMemoryMessageRepository implements MessageRepository {
	save(msg: Message): void {
		message = msg;
	}
}
const messageRepository = new InMemoryMessageRepository();

class StubDateProvider implements DateProvider {
	now: Date;
	getPublishedDate(): Date {
		return this.now;
	}
}
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
	messageRepository,
	dateProvider
);

function givenNowIs(date: Date) {
	dateProvider.now = date;
}

function whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
	postMessageUseCase.handle(postMessageCommand);
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
	expect(expectedMessage).toEqual(message);
}
