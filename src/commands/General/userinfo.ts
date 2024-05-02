import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
// import { send } from '@sapphire/plugin-editable-commands';
import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import { RandomLoadingMessage } from '../../lib/constants';
// const { EmbedBuilder } = require('discord.js');

@ApplyOptions<Command.Options>({
	description: 'Information about a given user',
	name: 'userinfo',
	cooldownDelay: 5000
})
export class UserCommand extends Command {
	// Register slash and context menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register slash command
		// registry.registerChatInputCommand({
		// 	name: this.name,
		// 	description: this.description
		// });

		registry.registerChatInputCommand((builder) =>
		builder //
			.setName(this.name)
			.setDescription(this.description)
			.addUserOption((option) => 
				option //
					.setName('user')
					.setDescription('User to fetch information about')
					.setRequired(false)
			)
		)

		// Register context menu command available from any message
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.Message
		},{
			idHints: ['1235654649911054388']
		});

		// Register context menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User
		},{
			idHints: ['1235654649911054388']
		});
	}

	// slash command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const userToGet = interaction.options.getUser('user') || interaction.member?.user;
		const memberToGet = interaction.guild?.members.cache.get(userToGet!.id);
		const joinDate = memberToGet?.joinedAt;
		const createDate = memberToGet?.user.createdAt;
		
		const loadingEmbed = new EmbedBuilder()
			.setDescription(`${RandomLoadingMessage}`)

		await interaction.reply({ embeds: [loadingEmbed]})
		// const client = this.container;
		// const topRoleId = interaction.guild?.members.me?.roles.cache.sort((a, b) => b.position - a.position).first()?.id;
		// const topRole = interaction.guild?.roles.cache.get(`${topRoleId}`);
		// const embedColor = topRole?.color;

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle(`${memberToGet?.displayName}`)
			.setDescription(`${userToGet?.username}`)
			.setThumbnail(`${memberToGet?.displayAvatarURL()}?size=1024`)
			// .setImage(`https://raw.githubusercontent.com/4ngel2769/Helix/main/src/db/assets/branding/helix-banner-2023.png`)
			.addFields({
				name: `General`,
				value: `
				> **Joined Discord :** <t:${Math.floor(joinDate!.getTime() / 1000)}:f>
				> **Joined server :** <t:${Math.floor(createDate!.getTime() / 1000 )}:f>
				> **ID :** \`${userToGet?.id}\`
				`
			},{
				name:`Guild`,
				value: `
				> **Top role :** **<@${memberToGet?.roles.highest.id}>**
				`
			})
			// .setFooter({text: `a`})
		console.log(userToGet)
		return interaction.editReply({ embeds: [embed] });
	}

	// context menu command
	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		const msg = await interaction.reply({ content: 'Ping?', ephemeral: true, fetchReply: true });

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			msg.createdTimestamp - interaction.createdTimestamp
		}ms.`;

		return interaction.editReply({ content });
	}
}
