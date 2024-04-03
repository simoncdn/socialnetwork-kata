#!/usr/bin/env node
import { Command } from 'commander';
import { DateProvider, PostMessageCommand, PostMessageUseCase } from './src/post-message.usecase';
import { InMemoryMessageRepository } from './src/message.inmemory.repository';

class RealDateProvider implements DateProvider {
	getPublishedDate(): Date {
		return new Date();
	}
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
	messageRepository,
	dateProvider
);
const program = new Command();

program
	.version('0.0.1')
	.description('Social network')
	.addCommand(
		new Command('post')
			.argument('<user>', 'current user')
			.argument('<content>', 'message content')
			.action((user, content) => {
				const postMessageCommand: PostMessageCommand = {
					id: "message-id",
					author: user,
					content: content,
				}
				try {
					postMessageUseCase.handle(postMessageCommand);
					console.log("✅ Message posted");
					console.log(messageRepository.message);
				}
				catch (error) {
					console.error("❌", error);
				}
			})
	)

async function main() {
	await program.parseAsync();
}
main();
