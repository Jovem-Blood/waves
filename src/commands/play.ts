import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord.js';
import play from 'play-dl';
import { paused, playing, queue } from '../utils/collections';

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

    if (!play.yt_validate(url)) {
      return interaction.reply("Não reconheço essa URL")
    }

    play.authorization()
    if (playing.get(guildId) || paused.get(guildId)) {
      if (queue.has(guildId)) {
        let musics = queue.get(guildId)!
        musics?.push(url)
        queue.set(guildId, musics)
      } else {
        queue.set(guildId, [url])
      }
      return interaction.reply("Adicionando música a lista")
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator
    })

    const source = await play.stream(url)

    const resource = createAudioResource(source.stream, {
      inputType: source.type
    })

    const player = createAudioPlayer()

    const sub = connection.subscribe(player)
    player.play(resource)
    player.on(AudioPlayerStatus.Idle, async () => {
      if (!queue.get(guildId) || queue.get(guildId)?.length === 0) {
        interaction.channel?.send("bye")
        connection.destroy()
        queue.delete(guildId)
        playing.delete(guildId)
        paused.delete(guildId)
      } else {
        const nextUrl = queue.get(guildId)!.shift()!.toString()
        const nextSource = await play.stream(nextUrl)
        const nextResource = createAudioResource(nextSource.stream, {
          inputType: source.type
        })
        player.play(nextResource)
        playing.set(guildId, player)
        play.video_info(nextUrl).then(info => {
          interaction.channel?.send(`Tocando agora **${info.video_details.title}**`)
        })
      }
    })
    playing.set(guildId, player)
    return interaction.reply("Vamo começar essa festa!")
  }
}
