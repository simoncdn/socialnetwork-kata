import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { EmptyMessageError, MessageTooLongError, PostMessageCommand } from "../post-message.usecase";
import { DateProvider } from "../post-message.usecase";
import { MessageRepository } from "../post-message.usecase";
import { Message } from "../post-message.usecase";
import { PostMessageUseCase } from "../post-message.usecase";

describe("Feature: Posting a message", () => {
	let fixture: Fixture;
	beforeEach(() => {
		fixture = createFixture();
	})

	describe("Rule: A message can contain a maximum of 280 characters", () => {
		test("Alice can post a message on her timeline", async () => {
			fixture.givenPublishedDate(new Date("2024-01-19T19:00:00Z"));

			await fixture.whenUserPostsAMessage({
				id: "message-id",
				author: "Alice",
				content: "Hello World!",
			})

			fixture.thenPostedMessageShouldBe({
				id: "message-id",
				author: "Alice",
				content: "Hello World!",
				publishedAt: new Date("2024-01-19T19:00:00Z"),
			})
		})
		test("Alice cannot post a message with more 280 characters", async () => {
			fixture.givenPublishedDate(new Date("2024-01-19T19:00:00Z"));

			await fixture.whenUserPostsAMessage({
				id: "message-id",
				author: "Alice",
				content: "a".repeat(281),
			})

			fixture.thenErrorShouldBe(MessageTooLongError)
		})
	});

	describe("Rule: A message cannot be empty", () => {
		test("Alice cannot post an empty message", async () => {
			fixture.givenPublishedDate(new Date("2024-01-19T19:00:00Z"));

			await fixture.whenUserPostsAMessage({
				id: "message-id",
				author: "Alice",
				content: "",
			})

			fixture.thenErrorShouldBe(EmptyMessageError)
		})
		test("Alice cannot post a message with only spaces", async () => {
			fixture.givenPublishedDate(new Date("2024-01-19T19:00:00Z"));

			await fixture.whenUserPostsAMessage({
				id: "message-id",
				author: "Alice",
				content: "   ",
			})

			fixture.thenErrorShouldBe(EmptyMessageError)
		})
	})
});

class StubDateProvider implements DateProvider {
	now: Date;
	getPublishedDate(): Date {
		return this.now;
	}
}

const createFixture = () => {
	let thrownError: Error;

	const dateProvider = new StubDateProvider();
	const messageRepository = new InMemoryMessageRepository();
	const postMessageUseCase = new PostMessageUseCase(
		messageRepository,
		dateProvider
	);

	return {
		givenPublishedDate(date: Date) {
			dateProvider.now = date;
		},
		async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
			try {
				await postMessageUseCase.handle(postMessageCommand);
			} catch (error) {
				thrownError = error;
			}
		},
		thenPostedMessageShouldBe(expectedMessage: Message) {
			expect(expectedMessage).toEqual(messageRepository.message);
		},
		thenErrorShouldBe(expectedErrorClass: new () => Error) {
			expect(thrownError).toBeInstanceOf(expectedErrorClass);
		},
	}
}

type Fixture = ReturnType<typeof createFixture>;
