import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, Message } from 'discord.js';

export class BasicCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public async messageRun(message: Message) {
    
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('Name').setDescription('Description')
    )
      .registerContextMenuCommand((builder) =>
      builder
        .setName('Name')
        .setType(ApplicationCommandType.Message)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    
  }
}