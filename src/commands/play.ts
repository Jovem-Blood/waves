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
      builder.setName('Play').setDescription('Play music')
    )
      .registerContextMenuCommand((builder) =>
      builder
        .setName('Play')
        .setType(ApplicationCommandType.Message)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    
  }
}