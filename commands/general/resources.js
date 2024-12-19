const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'resources',
    description: 'Displays important resources and paperwork for officers.',
    category: 'General',
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#0078FF')
            .setTitle('📄 Officer Resources & Paperwork')
            .setDescription('A curated list of resources essential for UTA officers. Use these links to manage your organization efficiently.')
            .addFields(
                {
                    name: '📝 **Training & Orientation**',
                    value: 
                        `[Officer Orientation](https://uta.instructure.com/enroll/KW3NY6)\n` +
                        `[Mandatory Risk Management Training](https://www.uta.edu/student-affairs/student-organizations/officer-resources/risk-management)`
                },
                {
                    name: '📊 **Organization Management**',
                    value: 
                        `[Check Organization Status](https://mavsuta.sharepoint.com/sites/StudentOrganizationsStaff/OrgDatabase)\n` +
                        `[Space Registration & Events](https://www.uta.edu/student-affairs/student-organizations/officer-resources/student-organization-space-reservation-and-resources)\n` +
                        `[Room Reservations Guide](https://cdn.web.uta.edu/-/media/project/website/engineering/documents-and-forms/engineering/student_org_classroom_access_guide.ashx)`
                },
                {
                    name: '📣 **Marketing & Advertising**',
                    value: `[Marketing Resources](https://www.uta.edu/student-affairs/student-organizations/officer-resources/marketing-resources)`
                },
                {
                    name: '💰 **Finances & Responsibilities**',
                    value: 
                        `[Finance Resources](https://www.uta.edu/student-affairs/student-organizations/officer-resources/finance)\n` +
                        `[Officer Responsibilities](https://www.uta.edu/student-affairs/student-organizations/officer-resources/responsibilities)`
                },
                {
                    name: '✈️ **Student Group Travel**',
                    value: `[Student Group Travel Guidelines](https://www.uta.edu/student-affairs/student-organizations/officer-resources/group-travel)`
                },
                {
                    name: '✨ **Starting a New Organization**',
                    value: `[Registering New Organizations](https://www.uta.edu/student-affairs/student-organizations/officer-resources/new-orgs)`
                },
                {
                    name: '🖨️ **Printing & Posting**',
                    value: 
                        `[Printing Resources](https://www.uta.edu/student-affairs/student-organizations/officer-resources/printing)\n` +
                        `[Posting Policy](https://www.uta.edu/student-affairs/student-organizations/officer-resources/posting-policy)`
                }
            )
            .setFooter({ text: 'momo-bot by xchar08' })
            .setTimestamp();

        // Send the embed
        try {
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending resources embed:', error);
            message.reply('❌ Unable to display the resources list.');
        }
    },
};
