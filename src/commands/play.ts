import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord.js';
import ytdl from 'ytdl-core';

export class PlayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('play').setDescription('Play music').addStringOption((opt) => opt.setName("url").setDescription("uma url do youtube").setRequired(true)
      )
    )
      .registerContextMenuCommand((builder) =>
        builder
          .setName('play')
          .setType(ApplicationCommandType.Message)
      );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guildId = interaction.guildId!;
    const guild = interaction.guild;
    const url = interaction.options.get('url')?.value?.toString() || '';

    const channel = guild?.members.cache.get(interaction.user.id)?.voice.channel;

    if (!channel) {
      return interaction.reply("tu precisa estar em um canal de voz, tio")
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator
    })


    const resource = createAudioResource(ytdl(url, { filter: 'audioonly' }))
    const player = createAudioPlayer()

    interaction.channel?.send(url)
    const sub = connection.subscribe(player)
    player.play(resource)
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy()
    })
    return interaction.reply("Vamo começar essa festa!")

  }
}
