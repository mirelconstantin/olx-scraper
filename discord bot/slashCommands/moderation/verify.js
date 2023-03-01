const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	name: 'verify',
	description: "Set simple verification for this server.",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'Administrator',
	options: [
        {
            name: 'set',
            description: 'Add role to a user.',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'The channel of verification',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: 'embed_title',
                    description: 'The verification embed title.',
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: 'embed_description',
                    description: 'The verification embed description.',
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        }
    ],
	run: async (client, interaction) => {
        if(interaction.options._subcommand === 'set') {
            try {
                const title = interaction.options.get('embed_title').value;
                const description = interaction.options.get('embed_description').value;
                const channel = interaction.options.get('channel').channel;
    
                const embed = new EmbedBuilder()
                .setTitle(title || 'BUN VENIT ★ VERIFICARE')
                .setDescription(description ||`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`)
                .setColor('#2f3136')
                .setThumbnail('https://i.imgur.com/SLCG7aO.png')
                .setFooter({ text: "✔️ | Apasa butonul de mai jos ca sa te verifici." });

                const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Verify')
                    .setStyle('Success')
                    .setCustomId('verify_button')
                );
        
                await channel.send({ embeds: [embed], components: [buttons] });
                return interaction.reply({ content: `Setted up verification.`, ephemeral: true });

            } catch {
                return interaction.reply({ content: `Sorry, I failed setting up...`, ephemeral: true });
            }

        }
	}
};
