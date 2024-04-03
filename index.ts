#!/usr/bin/env node
import { Command } from 'commander';
import { DateProvider, PostMessageCommand, PostMessageUseCase } from './src/post-message.usecase';
import { FileSystemMessageRepository } from './src/message.fs.repository';

class RealDateProvider implements DateProvider {
	getPublishedDate(): Date {
		return new Date();
	}
}

const messageRepository = new FileSystemMessageRepository();
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
			.action(async (user, content) => {
				const postMessageCommand: PostMessageCommand = {
					id: "message-id",
					author: user,
					content: content,
				}
				try {
					await postMessageUseCase.handle(postMessageCommand);
					console.log("✅ Message posted");
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
